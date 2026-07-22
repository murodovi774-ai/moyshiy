"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useTranslations } from "next-intl";

interface LiveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveSearchModal({ isOpen, onClose }: LiveSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const t = useTranslations("LiveSearch");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open search
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, price, old_price, images")
        .ilike("name", `%${query}%`)
        .limit(6);

      if (!error && data) {
        setResults(data);
      }
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-16 md:pt-28 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative z-[1001] w-full max-w-2xl bg-white rounded-[28px] border border-white/40 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Input Bar */}
            <div className="p-4 border-b border-border flex items-center gap-3">
              <Search className="w-6 h-6 text-primary shrink-0 ml-2" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("placeholder")}
                className="w-full bg-transparent text-lg font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
              ) : (
                query && (
                  <button onClick={() => setQuery("")} className="p-1 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                )
              )}
            </div>

            {/* Results Container */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
              {query.trim() !== "" && (
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                  {t("resultsFor")} "{query}"
                </p>
              )}

              {results.length > 0 ? (
                results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-muted/40 transition-colors group"
                  >
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/100"}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-xl shrink-0 bg-muted/20"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-bold text-sm text-foreground">
                          {Number(product.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS
                        </span>
                        {product.old_price && (
                          <span className="text-xs text-muted-foreground line-through">
                            {Number(product.old_price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                ))
              ) : query.trim() !== "" && !isLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="font-medium text-base">{t("noResults")}</p>
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-muted-foreground font-medium">
                  Masalan: <span className="text-primary font-bold">Barg</span>, <span className="text-primary font-bold">Kir yuvish</span>...
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
