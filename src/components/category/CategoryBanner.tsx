"use client";

import { motion } from "framer-motion";
import { Sparkles, Shirt, Droplets, Utensils, Zap } from "lucide-react";

interface CategoryBannerProps {
  slug: string;
  categoryName: string;
}

const bannerThemes: Record<string, { bg: string; icon: any; desc: string }> = {
  "kir-yuvish": {
    bg: "from-blue-600/90 to-cyan-500/90",
    icon: Shirt,
    desc: "Kiyimlarni chuqur va muloyim tozalovchi sifatli kir yuvish vositalari katalogi."
  },
  "tozalash": {
    bg: "from-teal-600/90 to-emerald-500/90",
    icon: Sparkles,
    desc: "Uyingizning barcha burchaklarini porlatuvchi professional tozalash vositalari."
  },
  "yumshatgich": {
    bg: "from-indigo-600/90 to-purple-500/90",
    icon: Droplets,
    desc: "Matolarga yoqimli ifor va mislsiz yumshoqlik beruvchi konsentrat yumshatgichlar."
  },
  "oshxona": {
    bg: "from-amber-600/90 to-orange-500/90",
    icon: Utensils,
    desc: "Oshxona idishlari va yuzalaridagi yog' hamda kirlarni osongina ketkazuvchi gellar."
  },
  "maishiy-kimyo": {
    bg: "from-sky-600/90 to-blue-600/90",
    icon: Zap,
    desc: "Kunlik va maxsus tozalash ishlari uchun xavfsiz va samarali maishiy kimyo mahsulotlari."
  }
};

export default function CategoryBanner({ slug, categoryName }: CategoryBannerProps) {
  const theme = bannerThemes[slug] || {
    bg: "from-foreground/90 to-foreground/80",
    icon: Sparkles,
    desc: "TozaUy.uz platformasidagi saralangan va kafolatlangan mahsulotlar."
  };

  const Icon = theme.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative w-full rounded-[32px] overflow-hidden bg-gradient-to-r ${theme.bg} text-white p-8 md:p-12 mb-8 shadow-xl shadow-black/5 flex items-center justify-between border border-white/20`}
    >
      <div className="relative z-10 max-w-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
          <Icon className="w-4 h-4" />
          Katalog Bo'limi
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">{categoryName}</h1>
        <p className="text-sm md:text-base text-white/90 font-medium leading-relaxed">
          {theme.desc}
        </p>
      </div>

      <div className="hidden lg:flex items-center justify-center w-36 h-36 rounded-full bg-white/10 backdrop-blur-2xl border border-white/30 text-white/90 shrink-0 transform rotate-12 hover:rotate-0 transition-transform">
        <Icon className="w-20 h-20" />
      </div>
    </motion.div>
  );
}
