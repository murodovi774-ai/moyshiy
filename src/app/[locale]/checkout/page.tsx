"use client";

import { motion } from "framer-motion";
import { Send, ShieldCheck, Truck, Loader2, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const cartStore = useCartStore();
  const t = useTranslations("Checkout");
  const [isMounted, setIsMounted] = useState(false);
  const [isCalculatingDelivery, setIsCalculatingDelivery] = useState(false);
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
  const [selectedRegionName, setSelectedRegionName] = useState<string>("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    region: "",
    address: "",
    comment: ""
  });

  const regions = [
    { id: "1", name: "Toshkent shahri" },
    { id: "2", name: "Toshkent viloyati" },
    { id: "3", name: "Andijon" },
    { id: "4", name: "Buxoro" },
    { id: "5", name: "Farg'ona" },
    { id: "6", name: "Jizzax" },
    { id: "7", name: "Xorazm" },
    { id: "8", name: "Namangan" },
    { id: "9", name: "Navoiy" },
    { id: "10", name: "Qashqadaryo" },
    { id: "11", name: "Qoraqalpog'iston" },
    { id: "12", name: "Samarqand" },
    { id: "13", name: "Sirdaryo" },
    { id: "14", name: "Surxondaryo" },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const subtotal = cartStore.getCartTotal();

  const btsTariffs: Record<string, number> = {
    "1": 24000,
    "2": 24000,
    "3": 26000,
    "4": 26000,
    "5": 26000,
    "6": 24000,
    "7": 30000,
    "8": 26000,
    "9": 26000,
    "10": 28000,
    "11": 32000,
    "12": 26000,
    "13": 24000,
    "14": 28000,
  };

  // Auto calculate BTS delivery instantly when region changes
  useEffect(() => {
    if (!formData.region) {
      setDeliveryPrice(0);
      setSelectedRegionName("");
      return;
    }

    const regObj = regions.find(r => r.id === formData.region);
    if (regObj) setSelectedRegionName(regObj.name);

    const price = btsTariffs[formData.region] || 26000;
    setDeliveryPrice(price);
  }, [formData.region]);

  if (!isMounted) return null;

  if (cartStore.items.length === 0) {
    router.push("/cart");
    return null;
  }

  const totalToPay = subtotal + deliveryPrice;

  const handleTelegramOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.region || !formData.address.trim()) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    const regionName = selectedRegionName || formData.region;

    // Build Telegram Order Payload
    let text = `🛍 *YANGI BUYURTMA (TozaUy.uz)*\n\n`;
    text += `👤 *Mijoz ismi:* ${formData.name}\n`;
    text += `📱 *Telefon raqami:* ${formData.phone}\n`;
    text += `🚚 *Jo'natish manzili:* Toshkent shahri MVO\n`;
    text += `📍 *Qabul qiluvchi viloyat:* ${regionName}\n`;
    text += `🏠 *Manzil:* ${formData.address}\n\n`;
    text += `🛒 *BUYURTILGAN MAHSULOTLAR:*\n`;
    
    cartStore.items.forEach((item, index) => {
      text += `${index + 1}. ${item.name} (x${item.quantity}) — ${Number(item.price * item.quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS\n`;
    });
    
    text += `\n💵 *Mahsulotlar narxi:* ${Number(subtotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS`;
    text += `\n🚚 *BTS Yetkazib berish narxi:* ${deliveryPrice === 0 ? 'Tanlanmagan' : Number(deliveryPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " UZS"}`;
    text += `\n💰 *YAKUNIY JAMI SUMMA: ${Number(totalToPay).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS*`;

    if (formData.comment.trim()) {
      text += `\n\n📝 *Izoh:* ${formData.comment}`;
    }

    const encodedText = encodeURIComponent(text);
    window.open(`https://t.me/IZZAT_3733?text=${encodedText}`, '_blank');
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-muted/10 pt-24 md:pt-32 pb-24 md:pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black mb-3 text-foreground tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-lg">{t("subtitle")}</p>
        </div>

        <form onSubmit={handleTelegramOrder} className="flex flex-col md:flex-row gap-8">
          
          {/* Left: Form Fields */}
          <div className="flex-1 bg-white p-6 md:p-8 rounded-[32px] border border-border shadow-sm space-y-6">
            <h2 className="text-xl font-bold border-b border-border pb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              {t("shippingDetails")}
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2 ml-1">{t("fullName")}</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder={t("fullNamePlaceholder")}
                  className="w-full bg-muted/30 border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary font-medium transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2 ml-1">{t("phone")}</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder={t("phonePlaceholder")}
                  className="w-full bg-muted/30 border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary font-medium transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2 ml-1">{t("region")}</label>
                <select 
                  required
                  value={formData.region}
                  onChange={e => setFormData({...formData, region: e.target.value})}
                  className="w-full bg-muted/30 border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary font-medium transition-colors cursor-pointer"
                >
                  <option value="">{t("selectRegion")}</option>
                  {regions.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2 ml-1">{t("address")}</label>
                <textarea 
                  required
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  placeholder={t("addressPlaceholder")}
                  rows={3}
                  className="w-full bg-muted/30 border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary font-medium transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2 ml-1">{t("comment")}</label>
                <textarea 
                  value={formData.comment}
                  onChange={e => setFormData({...formData, comment: e.target.value})}
                  placeholder={t("commentPlaceholder")}
                  rows={2}
                  className="w-full bg-muted/30 border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary font-medium transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right: Summary & Telegram Button */}
          <div className="w-full md:w-80 lg:w-96 flex flex-col gap-6">
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-border shadow-sm sticky top-24 space-y-6">
              <h2 className="text-xl font-bold border-b border-border pb-4">{t("payment")}</h2>
              
              <div className="space-y-3 text-sm border-b border-border pb-6">
                <div className="flex justify-between font-medium text-muted-foreground">
                  <span>{t("subtotal")}</span>
                  <span className="text-foreground font-bold">
                    {Number(subtotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS
                  </span>
                </div>
                
                <div className="flex justify-between font-medium text-muted-foreground items-center">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-primary" />
                    {t("deliveryPrice")}
                  </span>
                  <span className="text-foreground font-bold">
                    {isCalculatingDelivery ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    ) : deliveryPrice === 0 ? (
                      <span className="text-muted-foreground font-normal italic text-xs">Viloyatni tanlang</span>
                    ) : (
                      `${Number(deliveryPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS`
                    )}
                  </span>
                </div>

                {/* Delivery Notice */}
                {formData.region && deliveryPrice > 0 && (
                  <div className="space-y-1.5 bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium">
                    <p className="flex items-center gap-1.5 font-bold text-emerald-800">
                      <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>BTS Express tarifi (Toshkent ➔ {selectedRegionName}): {Number(deliveryPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS</span>
                    </p>
                    <p className="text-[11px] text-emerald-700 italic border-t border-emerald-200/60 pt-1.5">
                      ℹ️ Pochta narxi yuk og'irligiga qarab o'zgaradi (Bu narx 1 kg uchun kiritilgan).
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-foreground">{t("totalToPay")}</span>
                <span className="text-3xl font-black text-primary">
                  {Number(totalToPay).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS
                </span>
              </div>

              {/* Sole Primary Telegram Button */}
              <button 
                type="submit"
                className="w-full bg-[#2AABEE] text-white py-4 rounded-full font-bold text-lg hover:bg-[#229ED9] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#2AABEE]/20 hover:shadow-2xl hover:shadow-[#2AABEE]/40 flex items-center justify-center gap-3 touch-target transform-gpu"
              >
                <Send className="w-6 h-6" />
                {t("orderViaTelegram")}
              </button>

              <div className="pt-4 border-t border-border flex items-start gap-3 text-xs text-muted-foreground">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p>{t("secureInfo")}</p>
              </div>
            </div>
          </div>
          
        </form>
      </div>
    </div>
  );
}
