"use client";

import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

interface CategoryHeaderProps {
  onOpenMobileFilters: () => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  title: string;
  totalProducts: number;
}

export default function CategoryHeader({ 
  onOpenMobileFilters, 
  viewMode, 
  setViewMode,
  title,
  totalProducts
}: CategoryHeaderProps) {
  const t = useTranslations("Products");
  const showingText = t("showing", { start: 1, end: Math.min(24, totalProducts), total: totalProducts });

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-border gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 capitalize">{title.replace('-', ' ')}</h1>
        <p className="text-muted-foreground text-sm">{showingText}</p>
      </div>

      <div className="flex items-center justify-between w-full md:w-auto gap-4">
        {/* Mobile Filter Button */}
        <button 
          onClick={onOpenMobileFilters}
          className="lg:hidden flex items-center gap-2 bg-muted/50 border border-border px-4 py-2 rounded-full font-medium text-sm hover:bg-muted transition-colors touch-target"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t("filters")}
        </button>

        <div className="flex items-center gap-4 ml-auto md:ml-0">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden md:inline">{t("sortBy")}</span>
            <select className="bg-transparent border border-border rounded-full py-2 pl-4 pr-8 text-sm font-medium focus:outline-none focus:border-primary appearance-none cursor-pointer">
              <option>{t("popular")}</option>
              <option>{t("newest")}</option>
              <option>{t("priceLowHigh")}</option>
              <option>{t("priceHighLow")}</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="hidden md:flex items-center bg-muted/30 p-1 rounded-full border border-border">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-full transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-full transition-all ${viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
