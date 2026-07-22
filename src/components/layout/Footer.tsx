"use client";

import Link from "next/link";
import { Send, Phone, MapPin, Clock, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background pt-16 pb-24 md:pb-12 border-t border-white/10 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-14 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center text-white text-base font-black shadow-lg shadow-primary/30">
                T
              </span>
              TozaUy<span className="text-primary">.uz</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              O'zbekistondagi premium tozalash va maishiy vositalar e-commerce platformasi. Uyingiz uchun faqat 100% original va sifatli tovarlar.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://t.me/IZZAT_3733"
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#2AABEE] hover:shadow-[0_0_15px_rgba(42,171,238,0.5)] transition-all duration-250 ease-out hover:scale-110"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white border-b border-white/10 pb-2">Bo'limlar</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/categories/kir-yuvish" className="inline-block hover:text-white hover:translate-x-[3px] transition-all duration-250 ease-out">
                  Kir yuvish vositalari
                </Link>
              </li>
              <li>
                <Link href="/categories/tozalash" className="inline-block hover:text-white hover:translate-x-[3px] transition-all duration-250 ease-out">
                  Tozalash vositalari
                </Link>
              </li>
              <li>
                <Link href="/categories/yumshatgich" className="inline-block hover:text-white hover:translate-x-[3px] transition-all duration-250 ease-out">
                  Kiyim yumshatgichlar
                </Link>
              </li>
              <li>
                <Link href="/categories/oshxona" className="inline-block hover:text-white hover:translate-x-[3px] transition-all duration-250 ease-out">
                  Oshxona vositalari
                </Link>
              </li>
              <li>
                <Link href="/categories/all" className="inline-block hover:text-white hover:translate-x-[3px] transition-all duration-250 ease-out">
                  Barcha Katalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white border-b border-white/10 pb-2">Bog'lanish</h4>
            <ul className="space-y-3.5 text-sm text-gray-400">
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-250 ease-out">
                  <Phone className="w-4 h-4" />
                </div>
                <a href="tel:+998990273733" className="hover:text-white font-medium transition-colors duration-250">
                  +998 99 027 37 33
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-[#2AABEE]/10 border border-[#2AABEE]/20 flex items-center justify-center text-[#2AABEE] group-hover:bg-[#2AABEE] group-hover:text-white transition-all duration-250 ease-out">
                  <Send className="w-4 h-4" />
                </div>
                <a href="https://t.me/IZZAT_3733" target="_blank" rel="noreferrer" className="hover:text-white font-medium transition-colors duration-250">
                  @IZZAT_3733 (Telegram)
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0 ml-2" />
                <span>Toshkent shahri MVO</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
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

            <div className="flex flex-wrap gap-2.5 pt-1">
              {["UZCARD", "HUMO", "VISA", "MASTERCARD"].map((badge) => (
                <span
                  key={badge}
                  className="bg-white/10 border border-white/30 hover:border-primary/60 px-3.5 py-1.5 rounded-xl text-xs font-black text-white tracking-wider shadow-md hover:-translate-y-1 transition-all duration-250 ease-out"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* BTS Delivery Card */}
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-xs text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:scale-[1.02] transition-all duration-250 ease-out group mt-4">
              <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400 group-hover:rotate-12 transition-transform duration-250" />
              <span className="font-semibold leading-snug">BTS Express orqali butun O'zbekistonga tezkor yetkazib berish</span>
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
