"use client";

import { useState, useEffect } from "react";
import CategorySidebar from "@/components/category/CategorySidebar";
import CategoryHeader from "@/components/category/CategoryHeader";
import ProductCard, { Product } from "@/components/shared/ProductCard";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useTranslations } from "next-intl";

import CategoryBanner from "@/components/category/CategoryBanner";
import ProductSkeleton from "@/components/shared/ProductSkeleton";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = useTranslations("Products");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const [slug, setSlug] = useState("");

  useEffect(() => {
    Promise.resolve(params).then((p) => {
      setSlug(p.slug);
    });
  }, [params]);

  useEffect(() => {
    async function fetchProducts() {
      if (!slug) return;
      setIsLoading(true);
      
      let query = supabase.from("products").select("*, categories(name, slug), brands(name)").order('created_at', { ascending: false });

      if (slug !== "all") {
        query = query.eq("categories.slug", slug);
      }

      const { data, error } = await query;
      
      if (!error && data) {
        setProducts(data as any);
      }
      setIsLoading(false);
    }

    fetchProducts();
  }, [slug, supabase]);

  const categoryNameMap: Record<string, string> = {
    "kir-yuvish": "Kir yuvish vositalari",
    "tozalash": "Tozalash vositalari",
    "yumshatgich": "Kiyim yumshatgichlar",
    "oshxona": "Oshxona vositalari",
    "maishiy-kimyo": "Maishiy kimyo",
    "all": "Barcha Katalog"
  };

  const categoryTitle = categoryNameMap[slug] || slug || "Katalog";

  return (
    <div className="flex flex-col w-full min-h-screen bg-white pt-24 md:pt-32">
      <div className="container mx-auto px-4 md:px-6 mb-16">
        
        {/* Category Banner */}
        <CategoryBanner slug={slug} categoryName={categoryTitle} />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <CategorySidebar />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <CategoryHeader 
              title={categoryTitle}
              totalProducts={products.length}
              onOpenMobileFilters={() => setMobileFiltersOpen(true)}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />

            {isLoading ? (
              <ProductSkeleton count={6} />
            ) : products.length > 0 ? (
              <>
                {/* Product Grid */}
                <div className={`grid gap-4 md:gap-6 ${
                  viewMode === "grid" 
                    ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
                    : "grid-cols-1"
                }`}>
                  {products.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
                
                {/* Pagination (Visual only for now) */}
                <div className="flex items-center justify-center gap-2 mt-16 pt-8 border-t border-border">
                  <button className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:border-primary hover:text-primary transition-all disabled:opacity-50">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold shadow-md">1</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:border-primary hover:text-primary transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              /* Beautiful Empty State */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl">🍃</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{t("noProducts")}</h3>
                <p className="text-muted-foreground max-w-md">
                  {t("noProductsDesc")}
                </p>
                <button 
                  onClick={() => {}}
                  className="mt-8 bg-foreground text-background px-8 py-3 rounded-full font-bold hover:bg-foreground/80 transition-all touch-target"
                >
                  {t("clearFilters")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-[85vw] max-w-md bg-white z-50 lg:hidden shadow-2xl overflow-y-auto"
            >
              <CategorySidebar isMobile={true} onClose={() => setMobileFiltersOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
