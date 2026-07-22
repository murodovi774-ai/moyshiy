import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import InstagramGallery from "@/components/home/InstagramGallery";
import HeroSlider from "@/components/home/HeroSlider";
import IntroVideo from "@/components/home/IntroVideo";
import FadeInScroll from "@/components/shared/FadeInScroll";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/utils/supabase/server";

import TrustBadges from "@/components/home/TrustBadges";

export default async function Home() {
  const tHome = await getTranslations("Home");
  const supabase = await createClient();
  
  // Fetch initial products for home page
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*, categories(*)')
    .order('created_at', { ascending: false })
    .limit(8);

  // Fetch banners
  const { data: banners } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return (
    <div className="flex flex-col min-h-screen">
      <IntroVideo />
      
      {/* Hero Section */}
      <HeroSlider banners={banners || []} />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Featured Products */}
      <FadeInScroll className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                {tHome("trendingNow")}
              </h2>
              <p className="text-muted-foreground text-lg">{tHome("trendingSubtitle")}</p>
            </div>
            <Link 
              href="/categories/all" 
              className="hidden md:flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              {tHome("viewAll")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {featuredProducts?.map((product, idx) => (
              <ProductCard key={product.id} product={product as any} index={idx} />
            ))}
          </div>
          
          <Link 
            href="/categories/all" 
            className="md:hidden mt-8 w-full py-4 border-2 border-primary text-primary rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
          >
            {tHome("viewAll")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </FadeInScroll>

      <FadeInScroll>
        <WhyChooseUs />
      </FadeInScroll>
      
      <FadeInScroll>
        <InstagramGallery />
      </FadeInScroll>
    </div>
  );
}
