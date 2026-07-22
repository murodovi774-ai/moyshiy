"use client";

import { motion } from "framer-motion";
import { Users, Package, Headphones, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export default function TrustBadges() {
  const t = useTranslations("TrustBadges");

  const badges = [
    {
      icon: Users,
      title: t("clients"),
      description: t("clientsDesc"),
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: Package,
      title: t("products"),
      description: t("productsDesc"),
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: Headphones,
      title: t("support"),
      description: t("supportDesc"),
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
    {
      icon: ShieldCheck,
      title: t("guarantee"),
      description: t("guaranteeDesc"),
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="py-12 bg-white/40 backdrop-blur-md border-y border-white/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="p-6 rounded-[24px] bg-white/60 border border-white/50 backdrop-blur-xl hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all flex items-start gap-4"
              >
                <div className={`p-3.5 rounded-2xl border ${badge.color} shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-foreground mb-1">{badge.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{badge.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
