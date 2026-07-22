"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Eye, Heart, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  old_price?: number;
  images: string[];
  stock: number;
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_new?: boolean;
  has_discount?: boolean;
  categories?: { name: string; slug: string };
  brands?: { name: string };
}

interface ProductCardProps {
  product: Product;
  index?: number;
  onOpenMiniCart?: () => void;
}

export default function ProductCard({ product, onOpenMiniCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const tCommon = useTranslations("Common");

  const hasDiscount = product.old_price && product.old_price > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.old_price! - product.price) / product.old_price!) * 100) 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setIsAdded(true);

    toast.success(
      <div className="flex items-center gap-3">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/100"}
          alt={product.name}
          className="w-10 h-10 object-cover rounded-lg"
        />
        <div>
          <p className="font-bold text-sm text-foreground line-clamp-1">{product.name}</p>
          <p className="text-xs text-emerald-600 font-semibold">{tCommon("addToCart")}</p>
        </div>
      </div>
    );

    if (onOpenMiniCart) {
      onOpenMiniCart();
    }

    setTimeout(() => setIsAdded(false), 2000);
  };

  const primaryImage = product.images?.[0] || "https://via.placeholder.com/400";
  const hoverImage = product.images?.[1] || primaryImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white/60 backdrop-blur-md rounded-[28px] border border-white/40 p-4 shadow-sm hover:shadow-2xl hover:shadow-black/10 transition-all flex flex-col justify-between overflow-hidden"
    >
      <div>
        {/* Badges */}
        <div className="absolute top-6 left-6 z-20 flex flex-col gap-1.5 pointer-events-none">
          {product.is_new && (
            <span className="bg-blue-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md backdrop-blur-md">
              NEW
            </span>
          )}
          {hasDiscount && (
            <span className="bg-red-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md backdrop-blur-md">
              -{discountPercentage}%
            </span>
          )}
          {product.is_bestseller && (
            <span className="bg-amber-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md backdrop-blur-md">
              TOP
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-6 right-6 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-white/50 flex items-center justify-center text-muted-foreground hover:text-red-500 hover:scale-110 transition-all shadow-sm">
          <Heart className="w-4 h-4" />
        </button>

        {/* Product Image Container */}
        <Link href={`/product/${product.slug}`} className="block relative aspect-square w-full rounded-2xl overflow-hidden bg-muted/20 mb-4">
          <img
            src={isHovered ? hoverImage : primaryImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Category & Title */}
        <div className="space-y-1.5 px-1">
          {product.categories?.name && (
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              {product.categories.name}
            </span>
          )}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-bold text-base md:text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
      </div>

      {/* Pricing & Add to Cart Action */}
      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between gap-2 px-1">
        <div className="flex flex-col">
          <span className="font-extrabold text-base md:text-lg text-foreground">
            {Number(product.price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through font-medium">
              {Number(product.old_price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`h-11 px-4 rounded-full font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 touch-target ${
            isAdded
              ? "bg-emerald-600 text-white"
              : "bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Qo'shildi</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Savatga</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
