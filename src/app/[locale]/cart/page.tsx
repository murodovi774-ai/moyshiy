"use client";

import { motion } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useTranslations } from "next-intl";

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const cartStore = useCartStore();
  const cartItems = cartStore.items;
  const t = useTranslations("Cart");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Prevent hydration mismatch

  const subtotal = cartStore.getCartTotal();
  const total = subtotal;

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col w-full min-h-[70vh] pt-24 md:pt-32 items-center justify-center relative z-10">
        <div className="w-24 h-24 bg-primary/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6 text-primary">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-foreground">{t("emptyTitle")}</h2>
        <p className="text-foreground/80 mb-8 text-center max-w-sm">
          {t("emptyDesc")}
        </p>
        <Link 
          href="/categories/all"
          className="bg-primary/90 backdrop-blur-md border border-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary transition-all shadow-xl flex items-center gap-2 touch-target"
        >
          {t("startShopping")}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen pt-24 md:pt-32 pb-24 md:pb-16 relative z-10">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-foreground">{t("title")}</h1>
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {cartItems.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-4 rounded-[24px] border border-white/20 bg-white/40 backdrop-blur-md hover:bg-white/60 hover:shadow-xl hover:shadow-black/5 transition-all"
              >
                <Link href={`/product/${item.slug}`} className="w-24 h-24 md:w-32 md:h-32 shrink-0 bg-muted/20 rounded-2xl overflow-hidden">
                  <img src={item.images?.[0] || 'https://via.placeholder.com/200'} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                </Link>
                
                <div className="flex flex-col flex-1 py-1">
                  <div className="flex justify-between items-start gap-2">
                    <Link href={`/product/${item.slug}`} className="font-semibold md:text-lg line-clamp-2 hover:text-primary transition-colors">
                      {item.name}
                    </Link>
                    <button 
                      onClick={() => cartStore.removeItem(item.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0 touch-target"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="font-bold text-lg md:text-xl mt-1">
                    {Number(item.price).toLocaleString()} UZS
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <div className="flex items-center bg-muted/50 rounded-full border border-border p-1">
                      <button 
                        onClick={() => cartStore.updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all touch-target"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-semibold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => cartStore.updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all touch-target"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <span className="font-bold text-primary">
                      {(item.price * item.quantity).toLocaleString()} UZS
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white/40 backdrop-blur-md rounded-[24px] border border-white/20 p-6 md:p-8 sticky top-24 shadow-xl shadow-black/5">
              <h2 className="text-xl font-bold mb-6 text-foreground">{t("orderSummary")}</h2>
              
              {/* Coupon */}
              <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-4 w-4 text-foreground/50" />
                </div>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder={t("promoCode")}
                  className="w-full bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl py-3 pl-10 pr-24 focus:outline-none focus:border-primary text-sm font-medium text-foreground placeholder:text-foreground/50"
                />
                <button className="absolute inset-y-1.5 right-1.5 bg-foreground text-background px-4 rounded-lg text-sm font-bold hover:bg-foreground/80 transition-colors">
                  {t("apply")}
                </button>
              </div>

              <div className="space-y-4 text-sm mb-6 border-b border-border/50 pb-6">
                <div className="flex justify-between font-medium text-foreground/80">
                  <span>{t("subtotal")}</span>
                  <span className="text-foreground font-semibold">
                    {Number(subtotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-foreground">{t("total")}</span>
                <span className="text-3xl font-black text-primary">{total.toLocaleString()} UZS</span>
              </div>

              <Link 
                href="/checkout"
                className="w-full bg-primary/90 backdrop-blur-md border border-primary text-white py-4 rounded-full font-bold text-lg hover:bg-primary transition-all shadow-xl flex items-center justify-center gap-2 touch-target"
              >
                {t("proceedCheckout")}
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link 
                href="/categories/all"
                className="w-full bg-white/50 backdrop-blur-md border border-white/40 text-foreground py-4 rounded-full font-bold mt-4 hover:bg-white/80 transition-all flex items-center justify-center touch-target shadow-sm"
              >
                {t("continueShopping")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
