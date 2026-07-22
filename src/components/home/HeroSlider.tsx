"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  button_text: string;
  image_url: string;
  link?: string;
}

export default function HeroSlider({ banners }: { banners: Banner[] }) {
  const [particles, setParticles] = useState<any[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Generate subtle dust particles only on client to avoid hydration mismatch
    setParticles(
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        size: Math.random() * 3 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 18 + 12,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 1024) return;
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 20;
    const y = (clientY / window.innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  const displayBanners = banners && banners.length > 0 ? banners : [{
    id: "default-1",
    title: "Toza va Farovon Xonadon",
    subtitle: "Scandinavian uslubidagi luxury maishiy vositalar. Uyingizda poklik va oliy darajadagi qulaylikni his eting.",
    button_text: "Katalogga o'tish",
    image_url: "",
    link: "/categories/all"
  }];

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative h-[88vh] md:h-[100vh] min-h-[580px] md:min-h-[720px] w-full overflow-hidden bg-slate-900"
    >
      {/* Luxury Scandinavian Background Image with Desktop Parallax */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none transform-gpu scale-105"
        animate={{
          x: mousePos.x * -0.5,
          y: mousePos.y * -0.5,
        }}
        transition={{ type: "spring", stiffness: 40, damping: 20 }}
      >
        <img
          src="/hero_bg.png"
          alt="Luxury Interior Background"
          className="w-full h-full object-cover object-[75%_center] lg:object-center transition-all duration-1000"
        />
      </motion.div>

      {/* Cinematic Depth-of-Field Overlay */}
      <div className="absolute inset-0 z-1 bg-gradient-to-r from-white/75 via-white/40 to-transparent backdrop-blur-[1px] lg:backdrop-blur-none pointer-events-none" />
      <div className="absolute inset-0 z-1 bg-gradient-to-t from-white/60 via-transparent to-black/10 pointer-events-none" />

      {/* Moving Sunlight Sweep Ray */}
      <div className="absolute inset-0 z-2 pointer-events-none overflow-hidden">
        <div className="absolute -inset-[50%] bg-gradient-to-r from-transparent via-amber-100/15 to-transparent transform -rotate-45 animate-sunlight-sweep opacity-70" />
      </div>

      {/* Floating Dust Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white/60 shadow-[0_0_8px_rgba(255,255,255,0.9)]"
            style={{ 
              width: p.size, 
              height: p.size, 
              left: `${p.x}%`, 
              top: `${p.y}%` 
            }}
            animate={{
              y: [0, -120, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0, 0.75, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="w-full h-full z-20"
      >
        {displayBanners.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full flex items-center">
              <div className="relative container mx-auto px-4 md:px-12 z-30 pt-16 md:pt-28">
                <div className="max-w-xl md:max-w-2xl">
                  
                  {/* Apple / Dyson Quality Glassmorphism Card */}
                  <motion.div 
                    initial={{ y: 25, opacity: 0, scale: 0.97 }}
                    whileInView={{ y: 0, opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white/30 backdrop-blur-3xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden group transform-gpu"
                  >
                    {/* Glass Light Reflection Accent */}
                    <div className="absolute -inset-full top-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-45 transform-gpu group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent opacity-80 pointer-events-none" />
                    
                    {/* Staggered Title */}
                    <motion.h1 
                      initial={{ y: 15, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.7, delay: 0.1 }}
                      className="text-2xl sm:text-4xl md:text-6xl font-black leading-[1.15] mb-3 md:mb-6 text-foreground tracking-tight relative z-10"
                    >
                      {slide.title}
                    </motion.h1>
                    
                    {/* Staggered Subtitle */}
                    <motion.p 
                      initial={{ y: 15, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                      className="text-xs sm:text-base md:text-xl text-foreground/90 mb-6 md:mb-10 max-w-lg font-medium leading-relaxed relative z-10"
                    >
                      {slide.subtitle}
                    </motion.p>
                    
                    {/* Staggered Premium Blue Button */}
                    <motion.div
                      initial={{ y: 15, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.7, delay: 0.3 }}
                      className="relative z-10"
                    >
                      <Link 
                        href={slide.link || "/categories/all"}
                        className="group/btn relative inline-flex items-center gap-2.5 bg-primary text-white px-6 py-3.5 md:px-9 md:py-4.5 rounded-full font-bold text-sm md:text-lg hover:bg-primary/95 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 overflow-hidden transform-gpu touch-target"
                      >
                        <span className="relative z-10">{slide.button_text || "Katalogga o'tish"}</span>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 relative z-10 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                        
                        {/* Shimmer Ripple */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] z-0" />
                      </Link>
                    </motion.div>

                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        @keyframes sunRaySweep {
          0% { transform: translateX(-100%) rotate(-45deg); }
          50% { transform: translateX(100%) rotate(-45deg); }
          100% { transform: translateX(200%) rotate(-45deg); }
        }
        .animate-sunlight-sweep {
          animation: sunRaySweep 18s ease-in-out infinite;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .swiper-pagination {
          bottom: 20px !important;
        }
        .swiper-pagination-bullet {
          background: rgba(0,0,0,0.3);
          opacity: 1;
          width: 8px;
          height: 8px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .swiper-pagination-bullet-active {
          background: #0284c7;
          width: 28px;
          border-radius: 6px;
          box-shadow: 0 0 10px rgba(2,132,199,0.5);
        }
      `}</style>
    </section>
  );
}
