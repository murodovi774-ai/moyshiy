"use client";

import { Home, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect } from "react";

export default function BottomNav() {
  const pathname = usePathname();
  const cartItemCount = useCartStore(state => state.getItemCount());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Search", href: "/search", icon: Search },
    { name: "Cart", href: "/cart", icon: ShoppingBag, badge: cartItemCount },
    { name: "Profile", href: "/login", icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-border z-50 pb-safe shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
      <nav className="flex justify-around items-center h-[72px] px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.name}
              href={item.href}
              className="relative w-16 h-full flex flex-col items-center justify-center gap-1 touch-target group"
            >
              {isActive && (
                <motion.div 
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 w-8 h-1 bg-primary rounded-b-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className="relative">
                <item.icon className={`w-6 h-6 transition-colors duration-300 ${
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                }`} />
                {item.badge !== undefined && isMounted && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {item.badge}
                  </span>
                )}
              </div>
              
              <span className={`text-[10px] font-semibold transition-colors duration-300 ${
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
