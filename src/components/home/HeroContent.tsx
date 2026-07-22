"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function HeroContent() {
  const t = useTranslations("Hero");

  return (
    <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
      {/* Animated Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border backdrop-blur-sm mb-8"
      >
        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        <span className="text-sm font-medium">{t("badge")}</span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 max-w-5xl"
      >
        <span className="text-foreground">{t("title1")}</span>
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
          {t("title2")}
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
      >
        {t("subtitle")}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <Link 
          href="/categories/all" 
          className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/20 touch-target"
        >
          {t("cta")}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </div>
  );
}
