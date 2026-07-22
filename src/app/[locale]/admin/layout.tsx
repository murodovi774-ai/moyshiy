"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Award, 
  ShoppingCart, 
  Image as ImageIcon, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Brands", href: "/admin/brands", icon: Award },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Banners", href: "/admin/banners", icon: ImageIcon },
  { name: "Features", href: "/admin/features", icon: Award },
  { name: "Instagram", href: "/admin/instagram", icon: ImageIcon },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations("Admin");

  const sidebarLinks = [
    { name: t("dashboard"), href: "/admin", icon: LayoutDashboard },
    { name: t("products"), href: "/admin/products", icon: Package },
    { name: t("categories"), href: "/admin/categories", icon: Tags },
    { name: t("brands"), href: "/admin/brands", icon: Award },
    { name: t("orders"), href: "/admin/orders", icon: ShoppingCart },
    { name: t("banners"), href: "/admin/banners", icon: ImageIcon },
    { name: t("features"), href: "/admin/features", icon: Award },
    { name: t("instagram"), href: "/admin/instagram", icon: ImageIcon },
    { name: t("testimonials"), href: "/admin/testimonials", icon: MessageSquare },
    { name: t("settings"), href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      router.push("/login");
      router.refresh();
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-foreground text-background">
      <div className="p-6 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          TozaUy.uz <span className="text-primary font-normal">Admin</span>
        </Link>
        <LanguageSwitcher />
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-2 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/admin");
          const Icon = link.icon;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-primary text-white font-semibold shadow-md shadow-primary/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all font-medium"
        >
          <LogOut className="w-5 h-5" />
          {t("logout")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-muted/10 overflow-hidden font-sans">
      <Toaster position="top-right" richColors />
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-full shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-64 bg-foreground z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-border z-30">
          <Link href="/admin" className="text-xl font-bold">
            Admin Panel
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 touch-target"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
