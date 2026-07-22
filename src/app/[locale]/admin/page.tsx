"use client";

import { motion } from "framer-motion";
import { Package, ShoppingCart, DollarSign, Tags, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

// Types based on the SQL schema
interface Stats {
  products: number;
  orders: number;
  revenue: number;
  categories: number;
}

export default function AdminDashboard() {
  const supabase = createClient();
  const [stats, setStats] = useState<Stats>({ products: 0, orders: 0, revenue: 0, categories: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      // In a real scenario with lots of data, you would use a Postgres function (RPC) or count queries.
      // Here we fetch basic counts and limited lists.
      
      const [
        { count: productsCount },
        { count: ordersCount },
        { count: categoriesCount },
        { data: ordersData },
        { data: lowStockData }
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('products').select('*').lte('stock', 5).limit(5)
      ]);

      // Calculate simple revenue from recent orders (mocking historical sum for now)
      const recentRev = (ordersData || []).reduce((sum, o) => sum + Number(o.total_amount), 0);

      setStats({
        products: productsCount || 0,
        orders: ordersCount || 0,
        revenue: recentRev, // In real app, calculate total revenue properly
        categories: categoriesCount || 0
      });

      setRecentOrders(ordersData || []);
      setLowStockProducts(lowStockData || []);
      setIsLoading(false);
    }

    fetchDashboardData();
  }, [supabase]);

  const statCards = [
    { title: "Total Products", value: stats.products, icon: Package, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Total Orders", value: stats.orders, icon: ShoppingCart, color: "text-purple-500", bg: "bg-purple-50" },
    { title: "Revenue", value: `${stats.revenue.toLocaleString()} UZS`, icon: DollarSign, color: "text-green-500", bg: "bg-green-50" },
    { title: "Categories", value: stats.categories, icon: Tags, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, Admin. Here's what's happening.</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary/90 transition-all shadow-md touch-target"
        >
          + Add New Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-[24px] border border-border shadow-sm flex items-center gap-4"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-muted-foreground font-medium text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">
                  {isLoading ? <div className="h-8 w-16 bg-muted animate-pulse rounded" /> : stat.value}
                </h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Latest Orders */}
        <div className="xl:col-span-2 bg-white rounded-[24px] border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-bold">Latest Orders</h2>
            <Link href="/admin/orders" className="text-primary text-sm font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30">
                  <th className="p-4 font-semibold text-sm text-muted-foreground border-b border-border">Order ID</th>
                  <th className="p-4 font-semibold text-sm text-muted-foreground border-b border-border">Customer</th>
                  <th className="p-4 font-semibold text-sm text-muted-foreground border-b border-border">Status</th>
                  <th className="p-4 font-semibold text-sm text-muted-foreground border-b border-border">Total</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array(3).fill(null).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-4"><div className="h-4 bg-muted rounded w-20" /></td>
                      <td className="p-4"><div className="h-4 bg-muted rounded w-32" /></td>
                      <td className="p-4"><div className="h-6 bg-muted rounded-full w-24" /></td>
                      <td className="p-4"><div className="h-4 bg-muted rounded w-16" /></td>
                    </tr>
                  ))
                ) : recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/10 transition-colors border-b border-border last:border-0">
                      <td className="p-4 font-mono text-sm text-muted-foreground">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="p-4 font-medium">{order.customer_name}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                          ${order.status === 'pending' ? 'bg-orange-100 text-orange-700' : ''}
                          ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : ''}
                          ${order.status === 'processing' ? 'bg-blue-100 text-blue-700' : ''}
                        `}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-foreground">
                        {Number(order.total_amount).toLocaleString()} UZS
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-[24px] border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Low Stock Alerts
            </h2>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            {isLoading ? (
               Array(3).fill(null).map((_, i) => (
                <div key={i} className="flex gap-4 p-3 animate-pulse">
                  <div className="w-12 h-12 bg-muted rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/4" />
                  </div>
                </div>
              ))
            ) : lowStockProducts.length > 0 ? (
              <ul className="space-y-4">
                {lowStockProducts.map((product) => (
                  <li key={product.id} className="flex items-center gap-4 bg-muted/20 p-3 rounded-xl border border-border">
                    <img 
                      src={product.images?.[0] || 'https://via.placeholder.com/150'} 
                      alt={product.name} 
                      className="w-12 h-12 object-cover rounded-lg bg-white"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate text-foreground">{product.name}</h4>
                      <p className={`text-xs font-bold mt-1 ${product.stock === 0 ? 'text-red-500' : 'text-orange-500'}`}>
                        {product.stock === 0 ? 'Out of Stock' : `${product.stock} remaining`}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground py-8">
                All products are well stocked.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
