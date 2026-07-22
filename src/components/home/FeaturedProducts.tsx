"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard, { Product } from "@/components/shared/ProductCard";

export default function FeaturedProducts({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-muted/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
            >
              Featured Products
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: "60px" }}
              viewport={{ once: true }}
              className="h-1 bg-primary rounded-full"
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link 
              href="/categories/all" 
              className="hidden md:flex items-center gap-2 font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Link 
            href="/categories/all" 
            className="flex items-center gap-2 bg-white border border-border px-6 py-3 rounded-full font-semibold text-foreground hover:bg-muted transition-colors shadow-sm w-full justify-center"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
