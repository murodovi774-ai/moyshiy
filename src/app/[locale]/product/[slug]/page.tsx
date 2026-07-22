import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, categories(name), brands(name)")
    .eq("slug", slug)
    .single();

  if (!product) {
    notFound();
  }

  // Fetch related products (same category)
  const { data: relatedData } = await supabase
    .from("products")
    .select("*, categories(name), brands(name)")
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .limit(4);

  const relatedProducts = relatedData?.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    old_price: p.old_price,
    images: p.images,
    categoryName: p.categories?.name,
    brandName: p.brands?.name,
    is_new: p.is_new,
    is_best_seller: p.is_best_seller,
    in_stock: p.in_stock,
    stock: p.stock
  })) || [];

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* Main Product Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            
            {/* Left: Gallery */}
            <div className="w-full lg:w-1/2">
              <div className="sticky top-24">
                <ProductGallery images={product.images} />
              </div>
            </div>
            
            {/* Right: Info */}
            <div className="w-full lg:w-1/2">
              <ProductInfo product={product} />
            </div>

          </div>
        </div>
      </section>

      {/* Specifications & Details Section */}
      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-2xl font-bold mb-8">Specifications</h2>
          <div className="bg-white rounded-[24px] p-6 md:p-8 border border-border">
            <ul className="space-y-4">
              <li className="flex flex-col md:flex-row border-b border-border pb-4">
                <span className="font-semibold w-48 text-muted-foreground">Brand</span>
                <span className="font-medium">{product.brands?.name}</span>
              </li>
              <li className="flex flex-col md:flex-row border-b border-border pb-4">
                <span className="font-semibold w-48 text-muted-foreground">Category</span>
                <span className="font-medium">{product.categories?.name}</span>
              </li>
              <li className="flex flex-col md:flex-row border-b border-border pb-4">
                <span className="font-semibold w-48 text-muted-foreground">Volume/Weight</span>
                <span className="font-medium">500ml</span>
              </li>
              <li className="flex flex-col md:flex-row border-b border-border pb-4">
                <span className="font-semibold w-48 text-muted-foreground">Eco-Friendly</span>
                <span className="font-medium">Yes, 100% biodegradable</span>
              </li>
              <li className="flex flex-col md:flex-row">
                <span className="font-semibold w-48 text-muted-foreground">Scent</span>
                <span className="font-medium">Lemon & Mint</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="py-12">
          <div className="container mx-auto px-4 md:px-6 mb-8">
            <h2 className="text-3xl font-bold text-foreground">Related Products</h2>
          </div>
          <FeaturedProducts products={relatedProducts} />
        </div>
      )}

      {/* Mobile Sticky Add to Cart Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-border z-40 p-4 pb-safe flex items-center justify-between gap-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total</span>
          <span className="text-xl font-bold">${Number(product.price).toFixed(2)}</span>
        </div>
        <button 
          className="flex-1 bg-foreground text-background py-3 px-6 rounded-full font-bold hover:bg-foreground/90 transition-colors shadow-lg touch-target"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
