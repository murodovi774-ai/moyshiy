"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Camera, Phone, Mail, Home } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

export default function AdminSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  
  const [formData, setFormData] = useState({
    site_name: "Moyshiy",
    contact_email: "hello@moyshiy.com",
    contact_phone: "+1 234 567 890",
    address: "123 Clean Street, Premium District, City 10000",
    instagram_url: "https://instagram.com/moyshiy_cleaning",
    telegram_bot_token: "",
    telegram_chat_id: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (data) {
        setFormData({
          site_name: data.site_name || "",
          contact_email: data.contact_email || "",
          contact_phone: data.contact_phone || "",
          address: data.address || "",
          instagram_url: data.instagram_url || "",
          telegram_bot_token: data.telegram_bot_token || "",
          telegram_chat_id: data.telegram_chat_id || "",
        });
      } else if (error && error.code !== 'PGRST116') {
        toast.error("Failed to load settings");
      }
      setIsLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('settings')
      .update(formData)
      .eq('id', 1);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Settings saved successfully");
    }
    
    setIsSubmitting(false);
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your store settings.</p>
      </div>

      <div className="bg-white border border-border rounded-[24px] shadow-sm flex flex-col flex-1 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1">
          
          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-border pb-2">General Information</h2>
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block font-medium mb-2">Site Name</label>
                <input 
                  required value={formData.site_name} onChange={e => setFormData({...formData, site_name: e.target.value})}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-border pb-2">Contact & Social (Footer)</h2>
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block font-medium mb-2 flex items-center gap-2"><Mail className="w-4 h-4"/> Contact Email</label>
                <input 
                  type="email" value={formData.contact_email} onChange={e => setFormData({...formData, contact_email: e.target.value})}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block font-medium mb-2 flex items-center gap-2"><Phone className="w-4 h-4"/> Contact Phone</label>
                <input 
                  type="tel" value={formData.contact_phone} onChange={e => setFormData({...formData, contact_phone: e.target.value})}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block font-medium mb-2 flex items-center gap-2"><Home className="w-4 h-4"/> Physical Address</label>
                <input 
                  type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block font-medium mb-2 flex items-center gap-2"><Camera className="w-4 h-4"/> Instagram Profile URL</label>
                <input 
                  type="url" value={formData.instagram_url} onChange={e => setFormData({...formData, instagram_url: e.target.value})}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-border pb-2">Telegram Integration (For Orders)</h2>
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block font-medium mb-2">Telegram Bot Token</label>
                <input 
                  type="password" value={formData.telegram_bot_token} onChange={e => setFormData({...formData, telegram_bot_token: e.target.value})}
                  placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                />
              </div>
              <div>
                <label className="block font-medium mb-2">Telegram Chat ID</label>
                <input 
                  type="text" value={formData.telegram_chat_id} onChange={e => setFormData({...formData, telegram_chat_id: e.target.value})}
                  placeholder="123456789"
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Leave blank if you prefer clients to send orders directly to your personal telegram account via URL link instead of automated bot messages.
              </p>
            </div>
          </section>

          <div className="pt-8 border-t border-border flex justify-end">
            <button type="submit" disabled={isSubmitting} className="px-8 py-4 rounded-xl font-bold bg-primary text-white flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
