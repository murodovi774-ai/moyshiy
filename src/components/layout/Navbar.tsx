"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { useCartStore } from "@/store/useCartStore";
import { useTranslations } from "next-intl";
import MiniCart from "@/components/layout/MiniCart";
import LiveSearchModal from "@/components/layout/LiveSearchModal";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const cartStore = useCartStore();
  const tNav = useTranslations("Navbar");
  const cartCount = cartStore.items.reduce((acc, i) => acc + i.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: tNav("laundry"), href: "/categories/kir-yuvish" },
    { name: tNav("cleaning"), href: "/categories/tozalash" },
    { name: tNav("softeners"), href: "/categories/yumshatgich" },
    { name: tNav("kitchen"), href: "/categories/oshxona" },
    { name: tNav("catalog"), href: "/categories/all" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-2xl border-b border-white/30 shadow-md py-2.5"
            : "bg-white/50 backdrop-blur-md py-3.5 border-b border-white/10"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <span className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-primary text-white flex items-center justify-center font-black text-lg md:text-xl shadow-md shadow-primary/30">
                T
              </span>
              <span className="font-black text-xl md:text-2xl tracking-tight text-foreground">
                TozaUy<span className="text-primary font-bold">.uz</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-bold text-foreground/80 hover:text-primary transition-colors tracking-wide relative group py-1"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
                </Link>
              ))}
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              <LanguageSwitcher />

              {/* Desktop Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Qidiruv oynasini ochish"
                className="hidden sm:flex p-2 md:p-2.5 rounded-full bg-white/70 border border-white/50 text-foreground hover:text-primary hover:bg-white transition-all shadow-sm items-center gap-2 touch-target"
                title="Qidiruv (Ctrl+K)"
              >
                <Search className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden xl:inline text-xs font-semibold text-muted-foreground">Ctrl+K</span>
              </button>

              {/* Desktop Cart Button */}
              <button
                onClick={() => setIsMiniCartOpen(true)}
                aria-label="Savatni ochish"
                className="hidden sm:flex relative p-2 md:p-2.5 rounded-full bg-white/70 border border-white/50 text-foreground hover:text-primary hover:bg-white transition-all shadow-sm touch-target"
              >
                <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Mobil menyuni ochish"
                className="lg:hidden p-2 rounded-xl bg-white/70 border border-white/50 text-foreground hover:bg-white transition-all touch-target"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-2xl border-b border-border p-6 mt-2 shadow-2xl space-y-3 animate-in slide-in-from-top-4 duration-300">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-bold text-base text-foreground hover:text-primary transition-colors py-2 border-b border-border/40"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Mini Cart Right Drawer */}
      <MiniCart isOpen={isMiniCartOpen} onClose={() => setIsMiniCartOpen(false)} />

      {/* Live Search Modal */}
      <LiveSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsMiniCartOpen(true)}
      />
    </>
  );
}
