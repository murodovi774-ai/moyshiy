"use client";

import Link from "next/link";
import { Send, Phone, MapPin, Clock, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const tHome = useTranslations("Home");
  const tNav = useTranslations("Navbar");

  return (
    <footer className="bg-foreground text-background pt-16 pb-24 md:pb-12 border-t border-white/10 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">T</span>
              TozaUy.uz
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              O'zbekistondagi premium tozalash va maishiy vositalar e-commerce platformasi. Uyingiz uchun faqat 100% original va sifatli tovarlar.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://t.me/IZZAT_3733"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#2AABEE] transition-all hover:scale-110"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:to-purple-600 transition-all hover:scale-110"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white border-b border-white/10 pb-2">Bo'limlar</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/categories/kir-yuvish" className="hover:text-primary transition-colors">
                  Kir yuvish vositalari
                </Link>
              </li>
              <li>
                <Link href="/categories/tozalash" className="hover:text-primary transition-colors">
                  Tozalash vositalari
                </Link>
              </li>
              <li>
                <Link href="/categories/yumshatgich" className="hover:text-primary transition-colors">
                  Kiyim yumshatgichlar
                </Link>
              </li>
              <li>
                <Link href="/categories/oshxona" className="hover:text-primary transition-colors">
                  Oshxona vositalari
                </Link>
              </li>
              <li>
                <Link href="/categories/all" className="hover:text-primary transition-colors">
                  Barcha Katalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white border-b border-white/10 pb-2">Bog'lanish</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+99890273733" className="hover:text-white transition-colors">
                  +998 (90) 273-73-33
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Send className="w-4 h-4 text-[#2AABEE] shrink-0" />
                <a href="https://t.me/IZZAT_3733" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  @IZZAT_3733 (Telegram)
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>Toshkent shahri MVO</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dushanba - Yakshanba (09:00 - 20:00)</span>
              </li>
            </ul>
          </div>

          {/* Payment Badges & Guarantee */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white border-b border-white/10 pb-2">To'lov Usullari</h4>
            <p className="text-xs text-gray-400">
              Xaridlarni naqd yoki istalgan to'lov tizimi orqali xavfsiz amalga oshirishingiz mumkin.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-lg text-xs font-bold text-white tracking-wider">
                UZCARD
              </span>
              <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-lg text-xs font-bold text-white tracking-wider">
                HUMO
              </span>
              <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-lg text-xs font-bold text-white tracking-wider">
                VISA
              </span>
              <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-lg text-xs font-bold text-white tracking-wider">
                MASTERCARD
              </span>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 text-xs text-emerald-400 mt-4">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>BTS Express orqali butun O'zbekistonga tezkor yetkazib berish</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} TozaUy.uz. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-1">
            <span>Sifatli va premium toza maishiy vositalar</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
