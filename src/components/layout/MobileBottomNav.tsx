"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, ShoppingBag, Search, Heart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useTranslations } from "next-intl";

interface MobileBottomNavProps {
  onOpenSearch: () => void;
  onOpenCart: () => void;
}

export default function MobileBottomNav({ onOpenSearch, onOpenCart }: MobileBottomNavProps) {
  const pathname = usePathname();
  const cartStore = useCartStore();
  const t = useTranslations("MobileNav");
  const cartCount = cartStore.items.reduce((acc, i) => acc + i.quantity, 0);

  const navItems = [
    { label: t("home"), href: "/", icon: Home },
    { label: t("categories"), href: "/categories/all", icon: Grid },
    { label: t("search"), action: onOpenSearch, icon: Search },
    { label: t("cart"), action: onOpenCart, icon: ShoppingBag, badge: cartCount },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[900] bg-white/80 backdrop-blur-2xl border-t border-white/30 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-4 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = item.href ? pathname === item.href : false;

          if (item.action) {
            return (
              <button
                key={idx}
                onClick={item.action}
                className="flex flex-col items-center gap-1 p-2 relative text-muted-foreground hover:text-primary transition-colors touch-target"
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {Boolean(item.badge) && item.badge! > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={idx}
              href={item.href!}
              className={`flex flex-col items-center gap-1 p-2 relative transition-colors touch-target ${
                isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 bg-primary rounded-full absolute bottom-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
