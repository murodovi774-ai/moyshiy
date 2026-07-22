import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TozaUy.uz — Premium tozalash va maishiy vositalar",
    template: "%s | TozaUy.uz"
  },
  description: "O'zbekistondagi premium tozalash va maishiy vositalar internet do'koni. Uyingiz uchun 100% original va sifatli kir yuvish gellari, yumshatgichlar va tozalovchi vositalar.",
  keywords: ["TozaUy", "tozalash vositalari", "kir yuvish geli", "maishiy kimyo", "yumshatgich", "O'zbekiston", "Toshkent"],
  authors: [{ name: "TozaUy.uz" }],
  metadataBase: new URL("https://tozauy.uz"),
  openGraph: {
    title: "TozaUy.uz — Premium tozalash vositalari",
    description: "O'zbekistondagi premium tozalash va maishiy vositalar internet do'koni.",
    url: "https://tozauy.uz",
    siteName: "TozaUy.uz",
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TozaUy.uz — Premium tozalash vositalari",
    description: "High quality eco-friendly cleaning products for your home.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // prevents zoom on mobile forms
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <ConditionalLayout 
            navbar={<Navbar />}
            footer={<Footer />}
            bottomNav={<BottomNav />}
          >
            {children}
          </ConditionalLayout>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
