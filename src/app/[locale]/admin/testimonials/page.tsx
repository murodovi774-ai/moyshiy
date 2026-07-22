"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, Save, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ customer_name: "", comment: "", rating: 5, image_url: "" });

  const fetchTestimonials = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (!error && data) setTestimonials(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenForm = (t?: any) => {
    if (t) {
      setEditingId(t.id);
      setFormData({ customer_name: t.customer_name, comment: t.comment, rating: t.rating, image_url: t.image_url || "" });
    } else {
      setEditingId(null);
      setFormData({ customer_name: "", comment: "", rating: 5, image_url: "" });
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
        const { error } = await supabase.from('testimonials').update(formData).eq('id', editingId);
        if (error) throw error;
        toast.success("Testimonial updated");
      } else {
        const { error } = await supabase.from('testimonials').insert([formData]);
        if (error) throw error;
        toast.success("Testimonial created");
      }
      handleCloseForm();
      fetchTestimonials();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      toast.success("Testimonial deleted");
      fetchTestimonials();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.20))]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Testimonials</h1>
          <p className="text-muted-foreground mt-1">Manage customer reviews.</p>
        </div>
        
        <button 
          onClick={() => handleOpenForm()}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-[16px] font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Testimonial
        </button>
      </div>

      <div className="bg-white border border-border rounded-[24px] shadow-sm flex flex-col flex-1 overflow-hidden relative">
        {isFormOpen && (
          <div className="absolute inset-0 bg-white z-20 flex flex-col">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingId ? "Edit Testimonial" : "New Testimonial"}</h2>
              <button onClick={handleCloseForm} className="p-2 hover:bg-muted rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 max-w-2xl flex-1 overflow-y-auto space-y-6">
              <div>
                <label className="block font-medium mb-2">Customer Name</label>
                <input 
                  required value={formData.customer_name} onChange={e => setFormData({...formData, customer_name: e.target.value})}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Comment</label>
                <textarea 
                  required value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})}
                  rows={4}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Rating (1-5)</label>
                <input 
                  type="number" min="1" max="5" required value={formData.rating} onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Customer Image URL (Optional)</label>
                <input 
                  value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={handleCloseForm} className="px-6 py-3 rounded-xl font-medium border border-border hover:bg-muted">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-3 rounded-xl font-bold bg-primary text-white flex items-center gap-2">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save Testimonial
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
          ) : testimonials.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <p>No testimonials found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-muted/50 sticky top-0 z-10">
                <tr>
                  <th className="p-4 font-semibold text-muted-foreground border-b border-border">Customer</th>
                  <th className="p-4 font-semibold text-muted-foreground border-b border-border">Rating</th>
                  <th className="p-4 font-semibold text-muted-foreground border-b border-border">Comment</th>
                  <th className="p-4 font-semibold text-muted-foreground border-b border-border w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((t) => (
                  <motion.tr 
                    key={t.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border hover:bg-muted/20 transition-colors group"
                  >
                    <td className="p-4 font-medium flex items-center gap-3">
                      <img src={t.image_url || `https://ui-avatars.com/api/?name=${t.customer_name}&background=random`} alt={t.customer_name} className="w-8 h-8 rounded-full object-cover" />
                      {t.customer_name}
                    </td>
                    <td className="p-4">{t.rating} / 5</td>
                    <td className="p-4 text-muted-foreground truncate max-w-[200px]">{t.comment}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenForm(t)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(t.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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
