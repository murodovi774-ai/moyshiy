"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, Save, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", subtitle: "", button_text: "", button_link: "", image_url: "", is_active: true });

  const fetchBanners = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
    if (!error && data) setBanners(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpenForm = (banner?: any) => {
    if (banner) {
      setEditingId(banner.id);
      setFormData({ 
        title: banner.title, subtitle: banner.subtitle || "", 
        button_text: banner.button_text || "", button_link: banner.button_link || "", 
        image_url: banner.image_url, is_active: banner.is_active 
      });
    } else {
      setEditingId(null);
      setFormData({ title: "", subtitle: "", button_text: "", button_link: "", image_url: "", is_active: true });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase.from('banners').update(formData).eq('id', editingId);
        if (error) throw error;
        toast.success("Banner updated");
      } else {
        const { error } = await supabase.from('banners').insert([formData]);
        if (error) throw error;
        toast.success("Banner created");
      }
      handleCloseForm();
      fetchBanners();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const { error } = await supabase.from('banners').delete().eq('id', id);
      if (error) throw error;
      toast.success("Banner deleted");
      fetchBanners();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.20))]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Banners</h1>
          <p className="text-muted-foreground mt-1">Manage homepage hero banners.</p>
        </div>
        
        <button 
          onClick={() => handleOpenForm()}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-[16px] font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Banner
        </button>
      </div>

      <div className="bg-white border border-border rounded-[24px] shadow-sm flex flex-col flex-1 overflow-hidden relative">
        
        {isFormOpen && (
          <div className="absolute inset-0 bg-white z-20 flex flex-col">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingId ? "Edit Banner" : "New Banner"}</h2>
              <button onClick={handleCloseForm} className="p-2 hover:bg-muted rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 max-w-2xl flex-1 overflow-y-auto space-y-6">
              <div>
                <label className="block font-medium mb-2">Title</label>
                <input 
                  required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Subtitle</label>
                <input 
                  value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Image URL</label>
                <input 
                  required value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-medium mb-2">Button Text</label>
                  <input 
                    value={formData.button_text} onChange={e => setFormData({...formData, button_text: e.target.value})}
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-2">Button Link</label>
                  <input 
                    value={formData.button_link} onChange={e => setFormData({...formData, button_link: e.target.value})}
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isActive" 
                  checked={formData.is_active} 
                  onChange={e => setFormData({...formData, is_active: e.target.checked})}
                  className="w-5 h-5 accent-primary"
                />
                <label htmlFor="isActive" className="font-medium cursor-pointer">Active</label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={handleCloseForm} className="px-6 py-3 rounded-xl font-medium border border-border hover:bg-muted">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-3 rounded-xl font-bold bg-primary text-white flex items-center gap-2">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : banners.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <p>No banners found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {banners.map((banner) => (
                <motion.div 
                  key={banner.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border border-border rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col group"
                >
                  <div className="aspect-[21/9] bg-muted relative">
                    <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                    {!banner.is_active && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Inactive</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-lg mb-1">{banner.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{banner.subtitle}</p>
                    <div className="mt-auto flex justify-end gap-2 border-t border-border pt-4">
                      <button onClick={() => handleOpenForm(banner)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(banner.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
