"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export interface Testimonial {
  id: string;
  customer_name: string;
  comment: string;
  rating: number;
  image_url?: string;
}

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-primary text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/3 translate-x-1/3" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            What Our Customers Say
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "60px" }}
            viewport={{ once: true }}
            className="h-1 bg-white/30 rounded-full"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="pb-16"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-[24px] border border-white/20 h-full flex flex-col hover:bg-white/15 transition-colors">
                  <Quote className="text-white/20 w-10 h-10 mb-4" />
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-white/20 text-white/20'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-200 text-lg mb-8 italic flex-1">"{testimonial.comment}"</p>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 shrink-0">
                      <img 
                        src={testimonial.image_url || `https://ui-avatars.com/api/?name=${testimonial.customer_name}&background=random`}
                        alt={testimonial.customer_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.customer_name}</h4>
                      <span className="text-xs text-white/60 uppercase tracking-wider font-semibold">Verified Buyer</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet {
          background: rgba(255,255,255,0.5);
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #ffffff;
        }
      `}</style>
    </section>
  );
}
