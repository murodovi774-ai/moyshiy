"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Plus, Search, Edit, Trash2, MoreVertical, Copy, Package } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { useTranslations } from "next-intl";

export default function ProductsAdminPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslations("Admin");

  const fetchProducts = async () => {
    setIsLoading(true);
    let query = supabase.from('products').select(`
      *,
      categories ( name ),
      brands ( name )
    `).order('created_at', { ascending: false });
    
    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }

    const { data, error } = await query;
    if (error) {
      toast.error("Error fetching products");
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`${name} - ${t("delete")}?`)) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        toast.error("Failed to delete product");
      } else {
        toast.success("Product deleted successfully");
        setProducts(products.filter(p => p.id !== id));
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("products")}</h1>
          <p className="text-muted-foreground mt-1">{t("manageCatalog")}</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary/90 transition-all shadow-md flex items-center gap-2 touch-target"
        >
          <Plus className="w-5 h-5" />
          {t("addProduct")}
        </Link>
      </div>

      <div className="bg-white rounded-[24px] border border-border shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <input 
              type="text"
              placeholder={t("searchProducts")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/30 border border-border rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:border-primary transition-all text-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <button type="submit" className="hidden" />
          </form>
          
          <div className="text-sm font-medium text-muted-foreground">
            {products.length} {t("products")}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30">
                <th className="p-4 font-semibold text-sm text-muted-foreground border-b border-border w-16">{t("image")}</th>
                <th className="p-4 font-semibold text-sm text-muted-foreground border-b border-border">{t("name")}</th>
                <th className="p-4 font-semibold text-sm text-muted-foreground border-b border-border">{t("categoryBrand")}</th>
                <th className="p-4 font-semibold text-sm text-muted-foreground border-b border-border">{t("price")}</th>
                <th className="p-4 font-semibold text-sm text-muted-foreground border-b border-border">{t("stock")}</th>
                <th className="p-4 font-semibold text-sm text-muted-foreground border-b border-border text-right">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array(5).fill(null).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="w-12 h-12 bg-muted rounded-xl" /></td>
                    <td className="p-4"><div className="h-4 bg-muted rounded w-48" /></td>
                    <td className="p-4"><div className="h-4 bg-muted rounded w-32" /></td>
                    <td className="p-4"><div className="h-4 bg-muted rounded w-16" /></td>
                    <td className="p-4"><div className="h-6 bg-muted rounded-full w-20" /></td>
                    <td className="p-4"><div className="h-8 bg-muted rounded w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : products.length > 0 ? (
                products.map((product) => (
                  <motion.tr 
                    key={product.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-muted/10 transition-colors border-b border-border last:border-0 group"
                  >
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-xl border border-border bg-muted/20 overflow-hidden shrink-0">
                        <img 
                          src={product.images?.[0] || 'https://via.placeholder.com/150'} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-foreground line-clamp-2">{product.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">Slug: {product.slug}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-sm">{product.categories?.name || t("uncategorized")}</div>
                      <div className="text-xs text-muted-foreground mt-1">{product.brands?.name || t("noBrand")}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-foreground">{Number(product.price).toLocaleString()} UZS</div>
                      {product.old_price && <div className="text-xs text-muted-foreground line-through">{Number(product.old_price).toLocaleString()} UZS</div>}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide flex w-fit
                        ${product.stock === 0 ? 'bg-red-100 text-red-700' : 
                          product.stock < 10 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}
                      `}>
                        {product.stock === 0 ? t("outOfStock") : `${product.stock} ${t("inStock")}`}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/admin/products/${product.id}`}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title={t("edit")}
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title={t("delete")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="w-12 h-12 text-muted-foreground/30 mb-4" />
                      <p className="text-lg font-medium text-foreground">{t("noProductsFound")}</p>
                      <p>{t("adjustSearch")}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
