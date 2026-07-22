"use client";

import { useState, useEffect } from "react";
import { Search, Edit, Loader2, Eye } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error && data) setOrders(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      toast.success("Order status updated");
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.customer_name?.toLowerCase().includes(search.toLowerCase()) || 
    o.id?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.20))]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">View and manage customer orders.</p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-[24px] shadow-sm flex flex-col flex-1 overflow-hidden relative">
        <div className="p-4 md:p-6 border-b border-border flex justify-between items-center bg-muted/20">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by customer name or order ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors shadow-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <p>No orders found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-muted/50 sticky top-0 z-10">
                <tr>
                  <th className="p-4 font-semibold text-muted-foreground border-b border-border">Order ID</th>
                  <th className="p-4 font-semibold text-muted-foreground border-b border-border">Customer</th>
                  <th className="p-4 font-semibold text-muted-foreground border-b border-border">Date</th>
                  <th className="p-4 font-semibold text-muted-foreground border-b border-border">Total</th>
                  <th className="p-4 font-semibold text-muted-foreground border-b border-border">Status</th>
                  <th className="p-4 font-semibold text-muted-foreground border-b border-border w-32">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4 font-mono text-xs">{order.id.split('-')[0]}</td>
                    <td className="p-4">
                      <div className="font-medium">{order.customer_name}</div>
                      <div className="text-xs text-muted-foreground">{order.customer_phone}</div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-bold">${Number(order.total_amount).toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status || 'pending'}
                      </span>
                    </td>
                    <td className="p-4">
                      <select 
                        value={order.status || 'pending'}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className="bg-muted border border-border rounded-lg px-2 py-1 text-sm outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
