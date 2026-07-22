"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useTranslations } from "next-intl";

export default function InstagramGallery() {
  const [posts, setPosts] = useState<any[]>([]);
  const supabase = createClient();
  const t = useTranslations("Home");

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from('instagram_posts').select('*').order('created_at', { ascending: false }).limit(4);
      if (data) {
        setPosts(data);
      }
    };
    fetchPosts();
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl"
          >
            <div className="w-14 h-14 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Camera className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-1">{t("instagramTitle")}</h2>
              <p className="text-foreground/80 font-medium">{t("instagramSubtitle")}</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link 
              href="#" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 flex items-center gap-2 group shadow-xl"
            >
              @moyshiy_cleaning
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence>
            {posts.map((post, index) => (
              <motion.a
                key={post.id}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.15, duration: 0.6, type: "spring", bounce: 0.3 }}
                className="relative aspect-square overflow-hidden rounded-[24px] md:rounded-[32px] group block shadow-2xl shadow-black/50"
              >
                <img 
                  src={post.image_url} 
                  alt="Instagram post"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 transform group-hover:scale-100 transition-transform duration-500"
                  >
                    <Camera className="w-8 h-8" />
                  </motion.div>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
