"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";

export default function DiscountBanner() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-[32px] overflow-hidden bg-primary shadow-2xl"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center p-8 md:p-16 lg:p-20 gap-8 md:gap-16">
            <div className="flex-1 text-center md:text-left text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6">
                <Tag className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wide uppercase">Limited Time Offer</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Spring Cleaning <br/> <span className="text-green-300">Mega Sale</span>
              </h2>
              
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl">
                Get up to 40% off on all eco-friendly household cleaners. Keep your home spotless without harming the planet.
              </p>
              
              <Link 
                href="/categories/sale"
                className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl touch-target"
              >
                Shop the Sale
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="flex-1 w-full flex justify-center md:justify-end">
              <motion.div 
                initial={{ y: 20, rotate: 5 }}
                whileInView={{ y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative w-full max-w-sm aspect-square"
              >
                {/* Mock image representing the discount */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-[32px] p-4 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1584820927498-cafe4c2394a1?q=80&w=600&auto=format&fit=crop" 
                    alt="Sale items"
                    className="w-full h-full object-cover rounded-2xl opacity-90 mix-blend-overlay"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-500 text-white text-4xl md:text-5xl font-black w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center shadow-2xl rotate-12">
                      -40%
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
