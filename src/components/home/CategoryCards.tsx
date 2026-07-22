"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Shirt, 
  Sparkles, 
  Wind, 
  UtensilsCrossed, 
  Bath, 
  HeartHandshake,
  Grid
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export default function CategoryCards({ categories }: { categories: Category[] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
          >
            Shop by Category
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "60px" }}
            viewport={{ once: true }}
            className="h-1 bg-primary rounded-full"
          />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
        >
          {categories.map((category) => {
            return (
              <motion.div key={category.id} variants={itemVariants}>
                <Link href={`/categories/${category.slug}`} className="group block h-full">
                  <div className="flex flex-col items-center justify-center p-6 rounded-[20px] bg-muted/30 border border-transparent hover:border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 bg-blue-50 text-blue-600 overflow-hidden">
                      {category.image_url ? (
                         <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                      ) : (
                         <Grid strokeWidth={1.5} className="w-8 h-8" />
                      )}
                    </div>
                    <span className="font-semibold text-foreground text-center line-clamp-2 text-sm md:text-base">
                      {category.name}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
