"use client";

import { usePathname } from "next/navigation";

export default function ConditionalLayout({ 
  children, 
  navbar, 
  footer, 
  bottomNav 
}: { 
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
  bottomNav: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.includes('/admin');

  if (isAdmin) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      {/* Global Luxury Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat scale-105 pointer-events-none z-[-2]"
        style={{ backgroundImage: `url(/luxury-bg.png)` }}
      />
      <div className="fixed inset-0 bg-white/40 backdrop-blur-[40px] pointer-events-none z-[-1]" />
      
      {/* Sunlight sweep animation globally */}
      <div className="fixed inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 animate-[sunlight_40s_linear_infinite] opacity-40 pointer-events-none z-[-1]" />

      <div className="relative z-0 flex flex-col min-h-screen">
        {navbar}
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        {footer}
        {bottomNav}
      </div>
    </>
  );
}
