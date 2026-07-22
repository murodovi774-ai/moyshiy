"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useTranslations } from "next-intl";

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MiniCart({ isOpen, onClose }: MiniCartProps) {
  const cartStore = useCartStore();
  const t = useTranslations("MiniCart");
  const subtotal = cartStore.getCartTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-[1000] w-full max-w-md bg-white/95 backdrop-blur-2xl border-l border-white/20 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{t("title")}</h3>
                  <p className="text-xs text-muted-foreground">{cartStore.items.length} mahsulot</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Item List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartStore.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-4">
                  <ShoppingBag className="w-16 h-16 opacity-30 text-muted-foreground" />
                  <p className="font-medium text-lg text-foreground">{t("empty")}</p>
                </div>
              ) : (
                cartStore.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-muted/20 border border-border/50 rounded-2xl relative group"
                  >
                    <img
                      src={item.images?.[0] || "https://via.placeholder.com/150"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl shrink-0 bg-white"
                    />
                    <div className="flex flex-col flex-1 min-w-0 justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-sm text-foreground line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => cartStore.removeItem(item.id)}
                          className="text-muted-foreground hover:text-red-500 p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs font-bold text-primary">
                        {Number(item.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-white border border-border/60 rounded-lg p-0.5">
                          <button
                            onClick={() => cartStore.updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => cartStore.updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-foreground">
                          {Number(item.price * item.quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Actions */}
            {cartStore.items.length > 0 && (
              <div className="p-6 border-t border-border/50 bg-muted/10 space-y-4">
                <div className="flex justify-between items-center text-sm font-bold text-foreground">
                  <span>{t("subtotal")}</span>
                  <span className="text-xl text-primary font-black">
                    {Number(subtotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="py-3 px-4 rounded-xl border border-border bg-white hover:bg-muted font-bold text-sm text-center text-foreground transition-all"
                  >
                    {t("viewCart")}
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="py-3 px-4 rounded-xl bg-primary text-white hover:bg-primary/90 font-bold text-sm text-center flex items-center justify-center gap-1 transition-all shadow-md"
                  >
                    {t("checkout")}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
