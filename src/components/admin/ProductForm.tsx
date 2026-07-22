"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Save, UploadCloud, X, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  old_price: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  category_id: z.string().optional().nullable(),
  brand_id: z.string().optional().nullable(),
  is_featured: z.boolean().default(false),
  is_bestseller: z.boolean().default(false),
  is_new: z.boolean().default(false),
  has_discount: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: any;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [isUploading, setIsUploading] = useState(false);

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    async function loadOptions() {
      try {
        let { data: catData } = await supabase.from('categories').select('id, name').order('name');
        if (!catData || catData.length === 0) {
          const defaultCats = [
            { name: "Kir yuvish", slug: "kir-yuvish" },
            { name: "Tozalash", slug: "tozalash" },
            { name: "Yumshatgich", slug: "yumshatgich" },
            { name: "Oshxona", slug: "oshxona" },
            { name: "Maishiy Kimyo", slug: "maishiy-kimyo" }
          ];
          await supabase.from('categories').insert(defaultCats);
          const { data: freshCats } = await supabase.from('categories').select('id, name').order('name');
          catData = freshCats;
        }
        if (catData && catData.length > 0) {
          setCategories(catData);
        } else {
          setCategories([
            { id: "cat-1", name: "Kir yuvish" },
            { id: "cat-2", name: "Tozalash" },
            { id: "cat-3", name: "Yumshatgich" },
            { id: "cat-4", name: "Oshxona" },
            { id: "cat-5", name: "Maishiy Kimyo" }
          ]);
        }
      } catch (err) {
        console.error("Error loading options:", err);
      }
    }
    loadOptions();
  }, []);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      old_price: initialData?.old_price || undefined,
      stock: initialData?.stock || 0,
      category_id: initialData?.category_id || "",
      brand_id: initialData?.brand_id || "",
      is_featured: initialData?.is_featured || false,
      is_bestseller: initialData?.is_bestseller || false,
      is_new: initialData?.is_new || false,
      has_discount: initialData?.has_discount || false,
    },
  });

  const generateSlug = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setValue('slug', slug, { shouldValidate: true });
  };

  const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    
    try {
      const files = Array.from(e.target.files);
      const uploadedUrls: string[] = [];
      
      for (const file of files) {
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
          const filePath = `product_images/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file, { upsert: true });
            
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);
            
          uploadedUrls.push(publicUrl);
        } catch (storageErr) {
          console.warn("Storage upload failed, falling back to Data URL:", storageErr);
          const dataUrl = await fileToDataURL(file);
          uploadedUrls.push(dataUrl);
        }
      }
      
      setImages(prev => [...prev, ...uploadedUrls]);
      toast.success("Rasmlar yuklandi");
    } catch (error: any) {
      toast.error(error.message || "Rasm yuklashda xatolik yuz berdi");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      const oldPriceNum = data.old_price && !isNaN(Number(data.old_price)) && Number(data.old_price) > 0 
        ? Number(data.old_price) 
        : null;

      // UUID validation helper
      const isUuid = (str?: string | null) => str ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str) : false;
      const validCategoryId = isUuid(data.category_id) ? data.category_id : null;

      const payload: any = {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        price: Number(data.price),
        old_price: oldPriceNum,
        stock: Number(data.stock),
        category_id: validCategoryId,
        is_featured: Boolean(data.is_featured),
        is_bestseller: Boolean(data.is_bestseller),
        is_new: Boolean(data.is_new),
        has_discount: Boolean(data.has_discount),
        is_active: true,
        images: images,
      };

      let error;
      if (initialData?.id) {
        const res = await supabase.from('products').update(payload).eq('id', initialData.id);
        error = res.error;
      } else {
        const res = await supabase.from('products').insert([payload]);
        error = res.error;
      }

      if (error) {
        const errMsg = error.message || error.details || error.hint || JSON.stringify(error);
        console.error("Supabase Product Save Error details:", errMsg, error);
        throw new Error(errMsg);
      }

      toast.success(`Mahsulot muvaffaqiyatli ${initialData?.id ? 'yangilandi' : 'qo\'shildi'}!`);
      router.push('/admin/products');
      router.refresh();
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message || "Mahsulotni saqlashda xatolik yuz berdi");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 max-w-5xl mx-auto pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 bg-white border border-border rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            {initialData ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot yaratish'}
          </h1>
        </div>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-all shadow-xl hover:shadow-none flex items-center gap-2 disabled:opacity-70 touch-target"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Mahsulotni saqlash
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-[24px] border border-border shadow-sm space-y-6">
            <h2 className="text-xl font-bold border-b border-border pb-4">Asosiy ma'lumotlar</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">Mahsulot nomi *</label>
                <input 
                  {...register("name")}
                  onBlur={(e) => {
                    if (!watch('slug')) generateSlug(e.target.value);
                  }}
                  className="w-full bg-muted/30 border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary font-medium transition-colors"
                  placeholder="Masalan: Tozalovchi Gel"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">Slug *</label>
                <div className="flex gap-2">
                  <input 
                    {...register("slug")}
                    className="flex-1 bg-muted/30 border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary font-medium transition-colors"
                    placeholder="tozalovchi-gel"
                  />
                  <button 
                    type="button" 
                    onClick={() => generateSlug(watch('name'))}
                    className="bg-muted px-4 rounded-xl font-semibold text-sm hover:bg-border transition-colors"
                  >
                    Yaratish
                  </button>
                </div>
                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">Tavsif</label>
                <textarea 
                  {...register("description")}
                  rows={5}
                  className="w-full bg-muted/30 border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary font-medium transition-colors resize-none"
                  placeholder="Batafsil mahsulot tavsifi..."
                />
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-white p-6 md:p-8 rounded-[24px] border border-border shadow-sm space-y-6">
            <h2 className="text-xl font-bold border-b border-border pb-4">Rasmlar</h2>
            
            <div className="border-2 border-dashed border-border rounded-[20px] p-8 text-center hover:bg-muted/30 transition-colors">
              <input 
                type="file" 
                id="images" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              <label htmlFor="images" className="cursor-pointer flex flex-col items-center justify-center">
                {isUploading ? (
                  <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                ) : (
                  <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
                )}
                <span className="font-semibold text-foreground mb-1">Rasmlarni yuklash uchun bosing</span>
                <span className="text-sm text-muted-foreground">PNG, JPG, WEBP formatlari</span>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-border group bg-muted/20">
                    <img src={img} alt="Product" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-2 left-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                        Asosiy Rasm
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing, Category, Status */}
        <div className="space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-[24px] border border-border shadow-sm space-y-6">
            <h2 className="text-xl font-bold border-b border-border pb-4">Narx va Zaxira</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">Narxi (UZS) *</label>
                <input 
                  type="number"
                  step="any"
                  {...register("price")}
                  className="w-full bg-muted/30 border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary font-medium transition-colors"
                  placeholder="55000"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">Eski narxi (UZS)</label>
                <input 
                  type="number"
                  step="any"
                  {...register("old_price")}
                  className="w-full bg-muted/30 border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary font-medium transition-colors"
                  placeholder="70000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">Ombordagi soni *</label>
                <input 
                  type="number"
                  {...register("stock")}
                  className="w-full bg-muted/30 border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary font-medium transition-colors"
                  placeholder="100"
                />
                {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="bg-white p-6 md:p-8 rounded-[24px] border border-border shadow-sm space-y-6">
            <h2 className="text-xl font-bold border-b border-border pb-4">Kategoriya</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">Kategoriyani tanlang *</label>
                <select
                  {...register("category_id")}
                  className="w-full bg-muted/30 border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary font-medium transition-colors cursor-pointer"
                >
                  <option value="">Kategoriyani tanlang</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Product Status */}
          <div className="bg-white p-6 md:p-8 rounded-[24px] border border-border shadow-sm space-y-6">
            <h2 className="text-xl font-bold border-b border-border pb-4">Status va Nishonlar</h2>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" {...register("is_featured")} className="peer appearance-none w-5 h-5 border-2 border-muted-foreground/30 rounded-md checked:bg-primary checked:border-primary transition-all" />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm font-medium text-foreground">Bosh sahifada ko'rsatish</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" {...register("is_bestseller")} className="peer appearance-none w-5 h-5 border-2 border-muted-foreground/30 rounded-md checked:bg-primary checked:border-primary transition-all" />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm font-medium text-foreground">Eng ko'p sotilgan (Bestseller)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" {...register("is_new")} className="peer appearance-none w-5 h-5 border-2 border-muted-foreground/30 rounded-md checked:bg-primary checked:border-primary transition-all" />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm font-medium text-foreground">Yangi mahsulot nishoni</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" {...register("has_discount")} className="peer appearance-none w-5 h-5 border-2 border-muted-foreground/30 rounded-md checked:bg-primary checked:border-primary transition-all" />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm font-medium text-foreground">Chegirma nishoni</span>
              </label>
            </div>
          </div>
        </div>

      </div>
    </form>
  );
}
