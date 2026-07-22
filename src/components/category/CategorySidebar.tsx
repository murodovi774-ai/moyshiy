"use client";

import { useState } from "react";
import { Filter, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CategorySidebar({ isMobile = false, onClose = () => {} }) {
  const [priceRange, setPriceRange] = useState(500000);
  const t = useTranslations("Products");
  
  const content = (
    <div className="flex flex-col h-full w-full bg-white p-6 md:p-0">
      {isMobile && (
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <h2 className="text-xl font-bold">{t("filters")}</h2>
          <button onClick={onClose} className="p-2 touch-target">
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Search inside category */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">{t("search")}</h3>
        <div className="relative">
          <input 
            type="text" 
            placeholder={t("searchPlaceholder")}
            className="w-full bg-muted/30 border border-border rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:border-primary text-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mb-8 border-t border-border pt-8">
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">{t("brands")}</h3>
        <div className="space-y-3">
          {["Method", "Grove", "Blueland", "Cleancult", "Seventh Gen"].map((brand) => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-muted-foreground/30 rounded-md checked:bg-primary checked:border-primary transition-all" />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-8 border-t border-border pt-8">
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">{t("priceRange")}</h3>
        <div className="flex flex-col gap-4">
          <input 
            type="range" 
            min="0" 
            max="1000000" 
            step="25000"
            value={priceRange} 
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>0 UZS</span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
              {priceRange.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS
            </span>
            <span>1 000 000+ UZS</span>
          </div>
        </div>
      </div>
      
      {isMobile && (
        <div className="mt-auto pt-6 border-t border-border">
          <button 
            onClick={onClose}
            className="w-full bg-foreground text-background py-3.5 rounded-full font-bold touch-target"
          >
            {t("applyFilters")}
          </button>
        </div>
      )}
    </div>
  );

  if (isMobile) return content;

  return (
    <div className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24">
        {content}
      </div>
    </div>
  );
}
