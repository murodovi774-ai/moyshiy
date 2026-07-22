"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInScrollProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function FadeInScroll({ children, delay = 0, className = "" }: FadeInScrollProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.16, 1, 0.3, 1] // Apple-like smooth spring
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
