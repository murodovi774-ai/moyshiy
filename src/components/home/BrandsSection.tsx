"use client";

import { motion } from "framer-motion";

interface Brand {
  id: string;
  name: string;
  logo_url?: string;
}

export default function BrandsSection({ brands }: { brands: Brand[] }) {
  if (!brands || brands.length === 0) return null;

  return (
    <section className="py-12 border-y border-border bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
          Trusted by premium households featuring brands like
        </p>
        
        {/* Simple Marquee effect using CSS and Tailwind */}
        <div className="relative flex overflow-x-hidden">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-12 md:gap-24">
            {[...brands, ...brands, ...brands].map((brand, index) => (
              <div 
                key={`${brand.id}-${index}`} 
                className="inline-flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 w-32"
              >
                {brand.logo_url ? (
                  <img src={brand.logo_url} alt={brand.name} className="max-h-12 w-auto object-contain" />
                ) : (
                  <span className="text-xl font-bold font-serif">{brand.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
