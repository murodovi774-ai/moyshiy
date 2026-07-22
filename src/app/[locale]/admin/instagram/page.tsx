"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function InstagramAdminPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('instagram_posts').select('*').order('created_at', { ascending: false });
    if (error) toast.error(error.message);
    else setPosts(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return toast.error("Please select an image");
    
    setIsUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(`instagram/${fileName}`, imageFile);
        
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(`instagram/${fileName}`);

      const { error } = await supabase.from('instagram_posts').insert([{
        image_url: publicUrl,
        link: link || '#'
      }]);
      if (error) throw error;
      
      toast.success("Instagram post added");
      setImageFile(null);
      setLink("");
      fetchPosts();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Are you sure?")) return;
    
    try {
      const path = imageUrl.split('/').pop();
      if (path) {
        await supabase.storage.from('images').remove([`instagram/${path}`]);
      }
      const { error } = await supabase.from('instagram_posts').delete().eq('id', id);
      if (error) throw error;
      
      toast.success("Deleted");
      fetchPosts();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Instagram Gallery</h1>
      </div>

      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold mb-4">Add New Image</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="file" accept="image/*" required
            onChange={e => setImageFile(e.target.files?.[0] || null)}
            className="border p-3 rounded-lg"
          />
          <input 
            type="url" placeholder="Instagram Link (e.g. https://instagram.com/...)" 
            className="border p-3 rounded-lg" value={link} onChange={e => setLink(e.target.value)}
          />
          <button type="submit" disabled={isUploading} className="bg-primary text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 max-w-[200px]">
            {isUploading ? 'Uploading...' : <><Plus className="w-4 h-4"/> Add Image</>}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden relative group">
            <img src={post.image_url} className="w-full aspect-square object-cover" alt="Insta" />
            <button onClick={() => handleDelete(post.id, post.image_url)} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-4 h-4"/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
