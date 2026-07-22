"use client";

import { Search, X, RotateCcw, Filter } from "lucide-react";
import { useTranslations } from "next-intl";

interface CategorySidebarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  priceRange: number;
  setPriceRange: (val: number) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  onResetFilters: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const categoriesList = [
  { slug: "all", name: "Barchasi" },
  { slug: "kir-yuvish", name: "Kir yuvish vositalari" },
  { slug: "tozalash", name: "Tozalash vositalari" },
  { slug: "yumshatgich", name: "Kiyim yumshatgichlar" },
  { slug: "oshxona", name: "Oshxona vositalari" },
  { slug: "maishiy-kimyo", name: "Maishiy kimyo" },
];

export default function CategorySidebar({
  searchQuery,
  setSearchQuery,
  priceRange,
  setPriceRange,
  selectedCategory,
  setSelectedCategory,
  onResetFilters,
  isMobile = false,
  onClose = () => {},
}: CategorySidebarProps) {
  const t = useTranslations("Products");

  const content = (
    <div className="flex flex-col h-full w-full bg-white p-6 md:p-0">
      {isMobile && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Filtrlar</h2>
          </div>
          <button onClick={onClose} className="p-2 touch-target text-muted-foreground hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* 1. Live Product Search */}
      <div className="mb-8">
        <h3 className="font-extrabold mb-3 text-xs uppercase tracking-wider text-muted-foreground">
          QIDIRUV
        </h3>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Mahsulot nomini kiritishingiz mumkin..."
            className="w-full bg-muted/40 border border-border/80 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:border-primary text-sm font-semibold transition-colors"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Category Selection */}
      <div className="mb-8 border-t border-border/60 pt-6">
        <h3 className="font-extrabold mb-4 text-xs uppercase tracking-wider text-muted-foreground">
          KATEGORIYALAR
        </h3>
        <div className="space-y-2.5">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <label
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? "bg-primary/10 text-primary font-bold border border-primary/20"
                    : "text-foreground hover:bg-muted/40 font-medium"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span className="text-sm">{cat.name}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Max Price Slider */}
      <div className="mb-8 border-t border-border/60 pt-6">
        <h3 className="font-extrabold mb-4 text-xs uppercase tracking-wider text-muted-foreground">
          NARX ORALIG'I (MAKSIMAL)
        </h3>
        <div className="flex flex-col gap-4">
          <input
            type="range"
            min="10000"
            max="1000000"
            step="10000"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span>10 000 UZS</span>
            <span className="bg-primary text-white px-3 py-1.5 rounded-full font-black text-xs shadow-md">
              {priceRange.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS
            </span>
            <span>1 000 000+ UZS</span>
          </div>
        </div>
      </div>

      {/* 4. Reset Filters Button */}
      <div className="pt-2 border-t border-border/60">
        <button
          onClick={onResetFilters}
          className="w-full py-3 px-4 rounded-2xl border border-border bg-muted/20 hover:bg-muted font-bold text-xs flex items-center justify-center gap-2 text-foreground transition-all touch-target"
        >
          <RotateCcw className="w-4 h-4 text-primary" />
          Filtrlarni tozalash
        </button>
      </div>

      {isMobile && (
        <div className="mt-auto pt-6 border-t border-border">
          <button
            onClick={onClose}
            className="w-full bg-primary text-white py-4 rounded-full font-bold touch-target shadow-xl"
          >
            Natijalarni ko'rish
          </button>
        </div>
      )}
    </div>
  );

  if (isMobile) return content;

  return (
    <div className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24">{content}</div>
    </div>
  );
}
