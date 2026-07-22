import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // 1. Run next-intl middleware to handle locale routing (redirection and localization)
  const intlResponse = intlMiddleware(request);

  // 2. Attach Supabase to the localized response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            intlResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Handle Admin Auth Protection with locale support
  // The pathname might already include the locale (e.g. /uz/admin)
  const pathname = request.nextUrl.pathname;
  
  // Extract locale from path if present
  const segments = pathname.split('/');
  const locale = routing.locales.includes(segments[1] as any) ? segments[1] : routing.defaultLocale;
  
  // Check if it's an admin or login route (ignoring locale prefix if any)
  const isLoginRoute = pathname === '/login' || pathname === `/${locale}/login`;
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith(`/${locale}/admin`);

  if (!user && isAdminRoute) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  if (user && isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/admin`;
    return NextResponse.redirect(url);
  }

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|mov)$).*)",
  ],
};
