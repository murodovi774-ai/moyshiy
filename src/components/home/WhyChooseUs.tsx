"use client";

import { motion } from "framer-motion";
import { Leaf, Zap, Truck, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export default function WhyChooseUs() {
  const t = useTranslations("WhyChooseUs");

  const cards = [
    {
      icon: Leaf,
      title: t("card1Title"),
      description: t("card1Desc"),
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      icon: Zap,
      title: t("card2Title"),
      description: t("card2Desc"),
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      icon: Truck,
      title: t("card3Title"),
      description: t("card3Desc"),
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      icon: ShieldCheck,
      title: t("card4Title"),
      description: t("card4Desc"),
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-foreground"
          >
            {t("title")}
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="h-1.5 bg-primary rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/70 backdrop-blur-md border border-white/40 hover:border-primary/30 p-8 rounded-[32px] shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 text-center flex flex-col items-center group relative overflow-hidden transform-gpu"
              >
                {/* Subtle hover background highlight */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${card.color} shadow-sm relative z-10 border`}>
                  <Icon className="w-10 h-10" strokeWidth={1.75} />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-foreground relative z-10 group-hover:text-primary transition-colors">
                  {card.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base relative z-10">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
