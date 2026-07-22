"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Share2, ShoppingBag, Send, Minus, Plus, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Product } from "@/components/shared/ProductCard";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";

interface ProductInfoProps {
  product: Product;
}

import { useTranslations } from "next-intl";

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = product.stock === 0;
  const addItem = useCartStore((state) => state.addItem);
  const tCommon = useTranslations("Common");
  const tProducts = useTranslations("Products");

  const increaseQuantity = () => setQuantity(prev => Math.min(prev + 1, product.stock || 999));
  const decreaseQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

  const hasDiscount = product.old_price && product.old_price > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.old_price! - product.price) / product.old_price!) * 100) 
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${quantity} x ${product.name} ${tCommon("addToCart")}`);
  };

  const handleBuyTelegram = () => {
    let text = `🛍 *YANGI BUYURTMA (TozaUy.uz)*\n\n`;
    text += `📦 *Mahsulot:* ${product.name}\n`;
    text += `🔢 *Soni:* ${quantity} dona\n`;
    text += `💰 *Narxi:* ${Number(product.price * quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS\n`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://t.me/IZZAT_3733?text=${encodedText}`, '_blank');
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center gap-2 mb-4">
        {product.categories?.name && (
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {product.categories.name}
          </span>
        )}
        {product.categories?.name && product.brands?.name && (
          <span className="text-muted-foreground">•</span>
        )}
        {product.brands?.name && (
          <span className="text-sm font-bold text-primary uppercase tracking-wider">
            {product.brands.name}
          </span>
        )}
      </div>

      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
        {product.name}
      </h1>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl md:text-4xl font-bold text-foreground">
            {Number(product.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS
          </span>
          {hasDiscount && (
            <span className="text-xl text-muted-foreground line-through font-medium">
              {Number(product.old_price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS
            </span>
          )}
        </div>
        
        {hasDiscount && (
          <span className="bg-red-500/10 text-red-600 font-bold px-3 py-1 rounded-full text-sm">
            -{discountPercentage}%
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-8">
        {isOutOfStock ? (
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            {tCommon("outOfStock")}
          </span>
        ) : (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            {tCommon("inStock")}
          </span>
        )}
        <span className="text-muted-foreground text-sm">({product.stock || 0})</span>
      </div>

      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
        {product.description}
      </p>

      {/* Quantity & Actions */}
      <div className="flex flex-col gap-4 mt-auto">
        <div className="flex items-center gap-4 mb-2">
          <span className="font-semibold text-foreground">Soni:</span>
          <div className="flex items-center bg-muted/50 rounded-full border border-border p-1">
            <button 
              onClick={decreaseQuantity}
              disabled={quantity <= 1 || isOutOfStock}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all disabled:opacity-50 touch-target"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="w-12 text-center font-bold text-lg">{quantity}</span>
            <button 
              onClick={increaseQuantity}
              disabled={quantity >= (product.stock || 999) || isOutOfStock}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all disabled:opacity-50 touch-target"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex items-center justify-center gap-2 bg-foreground text-background py-4 px-8 rounded-full font-bold text-lg hover:bg-foreground/80 transition-all shadow-xl hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed touch-target"
          >
            <ShoppingBag className="w-5 h-5" />
            {tCommon("addToCart")}
          </button>
          
          <button 
            onClick={handleBuyTelegram}
            disabled={isOutOfStock}
            className="flex items-center justify-center gap-2 bg-[#2AABEE] text-white py-4 px-8 rounded-full font-bold text-lg hover:bg-[#229ED9] transition-all shadow-xl hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed touch-target"
          >
            <Send className="w-5 h-5" />
            Telegram
          </button>
        </div>
      </div>
    </div>
  );
}
