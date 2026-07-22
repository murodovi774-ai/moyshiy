"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Loader2, Save, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminBrands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = createClient();
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", logo_url: "" });

  const fetchBrands = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('brands').select('*').order('created_at', { ascending: false });
    if (!error && data) setBrands(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleOpenForm = (brand?: any) => {
    if (brand) {
      setEditingId(brand.id);
      setFormData({ name: brand.name, logo_url: brand.logo_url || "" });
    } else {
      setEditingId(null);
      setFormData({ name: "", logo_url: "" });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({ name: "", logo_url: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase.from('brands').update(formData).eq('id', editingId);
        if (error) throw error;
        toast.success("Brand updated successfully");
      } else {
        const { error } = await supabase.from('brands').insert([formData]);
        if (error) throw error;
        toast.success("Brand created successfully");
      }
      handleCloseForm();
      fetchBrands();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      const { error } = await supabase.from('brands').delete().eq('id', id);
      if (error) throw error;
      toast.success("Brand deleted");
      fetchBrands();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.20))]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Brands</h1>
          <p className="text-muted-foreground mt-1">Manage product brands.</p>
        </div>
        
        <button 
          onClick={() => handleOpenForm()}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-[16px] font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Brand
        </button>
      </div>

      <div className="bg-white border border-border rounded-[24px] shadow-sm flex flex-col flex-1 overflow-hidden relative">
        
        {isFormOpen && (
          <div className="absolute inset-0 bg-white z-20 flex flex-col">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingId ? "Edit Brand" : "New Brand"}</h2>
              <button onClick={handleCloseForm} className="p-2 hover:bg-muted rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 max-w-2xl flex-1 overflow-y-auto space-y-6">
              <div>
                <label className="block font-medium mb-2">Brand Name</label>
                <input 
                  required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Logo URL (Optional)</label>
                <input 
                  value={formData.logo_url} onChange={e => setFormData({...formData, logo_url: e.target.value})}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={handleCloseForm} className="px-6 py-3 rounded-xl font-medium border border-border hover:bg-muted">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-3 rounded-xl font-bold bg-primary text-white flex items-center gap-2">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="p-4 md:p-6 border-b border-border flex justify-between items-center bg-muted/20">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search brands..." 
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
          ) : filteredBrands.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <p>No brands found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-muted/50 sticky top-0 z-10">
                <tr>
                  <th className="p-4 font-semibold text-muted-foreground border-b border-border">Name</th>
                  <th className="p-4 font-semibold text-muted-foreground border-b border-border w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBrands.map((brand) => (
                  <motion.tr 
                    key={brand.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border hover:bg-muted/20 transition-colors group"
                  >
                    <td className="p-4 font-medium flex items-center gap-3">
                      {brand.logo_url && <img src={brand.logo_url} alt={brand.name} className="w-8 h-8 object-contain" />}
                      {brand.name}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenForm(brand)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(brand.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
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
