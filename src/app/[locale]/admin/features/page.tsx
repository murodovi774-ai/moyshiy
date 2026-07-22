"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Edit } from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturesAdminPage() {
  const [features, setFeatures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon_name: "ShieldCheck"
  });

  const fetchFeatures = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('features').select('*').order('created_at', { ascending: true });
    if (error) {
      toast.error(error.message);
    } else {
      setFeatures(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase.from('features').update(formData).eq('id', editingId);
        if (error) throw error;
        toast.success("Feature updated");
      } else {
        const { error } = await supabase.from('features').insert([formData]);
        if (error) throw error;
        toast.success("Feature created");
      }
      setFormData({ title: "", description: "", icon_name: "ShieldCheck" });
      setEditingId(null);
      fetchFeatures();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const { error } = await supabase.from('features').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Deleted");
      fetchFeatures();
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Why Choose Us Features</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Feature' : 'Add New Feature'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" placeholder="Title (e.g. Original Products)" required
            className="border p-3 rounded-lg" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
          />
          <textarea 
            placeholder="Description" required rows={3}
            className="border p-3 rounded-lg" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
          />
          <input 
            type="text" placeholder="Lucide Icon Name (e.g. ShieldCheck, Truck, CreditCard)" required
            className="border p-3 rounded-lg" value={formData.icon_name} onChange={e => setFormData({...formData, icon_name: e.target.value})}
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg flex items-center gap-2">
              {editingId ? <Edit className="w-4 h-4"/> : <Plus className="w-4 h-4"/>} {editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button type="button" onClick={() => {setEditingId(null); setFormData({title:"", description:"", icon_name:"ShieldCheck"})}} className="bg-gray-200 px-6 py-2 rounded-lg">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-2xl border shadow-sm flex justify-between items-start">
            <div>
              <div className="font-bold mb-1">{item.title} (Icon: {item.icon_name})</div>
              <div className="text-sm text-gray-500">{item.description}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => {setEditingId(item.id); setFormData({title: item.title, description: item.description, icon_name: item.icon_name});}} className="p-2 text-blue-500 bg-blue-50 rounded-lg"><Edit className="w-4 h-4"/></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 bg-red-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
