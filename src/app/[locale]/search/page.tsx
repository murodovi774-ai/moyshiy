"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, X, Clock, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import ProductCard, { Product } from "@/components/shared/ProductCard";
import { createClient } from "@/utils/supabase/client";

// Mock Data for suggestions
const recentSearches = ["Dish soap", "Laundry pods", "Glass cleaner", "Microfiber cloths"];
const trendingSearches = ["Eco-friendly starter kit", "Lavender fabric softener", "Multi-surface cleaner", "Bamboo toilet paper"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const supabase = createClient();

  const handleSearch = async (e?: React.FormEvent, term?: string) => {
    if (e) e.preventDefault();
    const searchQuery = term || query;
    if (!searchQuery.trim()) return;
    
    setQuery(searchQuery);
    setIsSearching(true);
    setHasSearched(true);
    
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name), brands(name)")
      .ilike("name", `%${searchQuery}%`);

    if (!error && data) {
      setResults(data as any);
    }
    
    setIsSearching(false);
  };

  const clearSearch = () => {
    setQuery("");
    setHasSearched(false);
    setResults([]);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-white pt-24 md:pt-32 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        
        {/* Search Input Area */}
        <div className="mb-12">
          <form onSubmit={(e) => handleSearch(e)} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="block w-full pl-12 pr-12 py-4 md:py-5 bg-muted/30 border-2 border-transparent hover:border-border focus:bg-white focus:border-primary rounded-2xl text-lg md:text-xl font-medium transition-all shadow-sm focus:shadow-md outline-none"
              autoFocus
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center touch-target"
                >
                  <div className="bg-muted p-1 rounded-full hover:bg-muted-foreground/20 transition-colors">
                    <X className="h-5 w-5 text-muted-foreground" />
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {!hasSearched && !query ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Recent Searches */}
              <div>
                <h3 className="flex items-center gap-2 font-bold text-lg mb-4">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleSearch(undefined, term)}
                      className="bg-muted/50 hover:bg-muted border border-border px-4 py-2 rounded-full text-sm font-medium transition-colors touch-target"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Trending */}
              <div>
                <h3 className="flex items-center gap-2 font-bold text-lg mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Trending Now
                </h3>
                <ul className="space-y-3">
                  {trendingSearches.map((term, idx) => (
                    <li key={idx}>
                      <button 
                        onClick={() => handleSearch(undefined, term)}
                        className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-muted/30 transition-colors text-left group"
                      >
                        <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">{term}</span>
                        <ArrowRight className="w-4 h-4 text-transparent group-hover:text-primary transition-all -translate-x-2 group-hover:translate-x-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : isSearching ? (
            /* Loading Skeleton */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col bg-white rounded-[20px] border border-border overflow-hidden animate-pulse">
                  <div className="aspect-square bg-muted" />
                  <div className="p-4 flex flex-col gap-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-6 bg-muted rounded w-1/3 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Search Results */
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl md:text-2xl font-bold">
                  Results for "<span className="text-primary">{query}</span>"
                </h2>
                <span className="text-muted-foreground font-medium bg-muted/50 px-3 py-1 rounded-full text-sm">
                  {results.length} found
                </span>
              </div>
              
              {results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {results.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              ) : (
                /* No Results State */
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                    <SearchIcon className="w-10 h-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">No results found</h3>
                  <p className="text-muted-foreground max-w-md mb-8">
                    We couldn't find anything matching "{query}". Check the spelling or try a more generic term.
                  </p>
                  <button 
                    onClick={clearSearch}
                    className="bg-foreground text-background px-8 py-3 rounded-full font-bold hover:bg-foreground/80 transition-all touch-target"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
