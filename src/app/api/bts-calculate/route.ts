import { NextResponse } from "next/server";

// BTS Express Official Tariff Matrix (Sender = Tashkent City)
// Zone 0 (0-zona): Toshkent shahri, Toshkent viloyati -> 24,000 UZS
// Zone 1 (1-zona): Jizzax, Sirdaryo (Guliston) -> 24,000 UZS
// Zone 2 (2-zona): Samarqand, Buxoro, Navoiy, Andijon, Namangan, Farg'ona -> 26,000 UZS
// Zone 3 (3-zona): Qashqadaryo (Qarshi), Surxondaryo (Termiz) -> 28,000 UZS
// Zone 4 (4-zona): Xorazm (Urganch) -> 30,000 UZS
// Zone 5 (5-zona): Qoraqalpog'iston (Nukus) -> 32,000 UZS

const regionPrices: Record<string, { price: number; name: string; zone: string }> = {
  // IDs
  "1":  { price: 24000, name: "Toshkent shahri", zone: "0-zona" },
  "2":  { price: 24000, name: "Toshkent viloyati", zone: "0-zona" },
  "3":  { price: 26000, name: "Andijon", zone: "2-zona" },
  "4":  { price: 26000, name: "Buxoro", zone: "2-zona" },
  "5":  { price: 26000, name: "Farg'ona", zone: "2-zona" },
  "6":  { price: 24000, name: "Jizzax", zone: "1-zona" },
  "7":  { price: 30000, name: "Xorazm", zone: "4-zona" },
  "8":  { price: 26000, name: "Namangan", zone: "2-zona" },
  "9":  { price: 26000, name: "Navoiy", zone: "2-zona" },
  "10": { price: 28000, name: "Qashqadaryo", zone: "3-zona" },
  "11": { price: 32000, name: "Qoraqalpog'iston", zone: "5-zona" },
  "12": { price: 26000, name: "Samarqand", zone: "2-zona" },
  "13": { price: 24000, name: "Sirdaryo", zone: "1-zona" },
  "14": { price: 28000, name: "Surxondaryo", zone: "3-zona" },

  // String Names
  "Toshkent shahri": { price: 24000, name: "Toshkent shahri", zone: "0-zona" },
  "Toshkent viloyati": { price: 24000, name: "Toshkent viloyati", zone: "0-zona" },
  "Andijon": { price: 26000, name: "Andijon", zone: "2-zona" },
  "Buxoro": { price: 26000, name: "Buxoro", zone: "2-zona" },
  "Farg'ona": { price: 26000, name: "Farg'ona", zone: "2-zona" },
  "Jizzax": { price: 24000, name: "Jizzax", zone: "1-zona" },
  "Xorazm": { price: 30000, name: "Xorazm", zone: "4-zona" },
  "Namangan": { price: 26000, name: "Namangan", zone: "2-zona" },
  "Navoiy": { price: 26000, name: "Navoiy", zone: "2-zona" },
  "Qashqadaryo": { price: 28000, name: "Qashqadaryo", zone: "3-zona" },
  "Qoraqalpog'iston": { price: 32000, name: "Qoraqalpog'iston", zone: "5-zona" },
  "Samarqand": { price: 26000, name: "Samarqand", zone: "2-zona" },
  "Sirdaryo": { price: 24000, name: "Sirdaryo", zone: "1-zona" },
  "Surxondaryo": { price: 28000, name: "Surxondaryo", zone: "3-zona" },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { region } = body;

    const matched = regionPrices[String(region)];
    const price = matched ? matched.price : 26000;
    const zoneName = matched ? matched.zone : "2-zona";

    return NextResponse.json({ 
      success: true, 
      price,
      zoneName,
      senderCity: "Toshkent shahri",
      message: `BTS Express ${zoneName} tarifi bo'yicha hisoblandi`
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      price: 26000, 
      senderCity: "Toshkent shahri",
      message: "BTS tarifi bo'yicha hisoblandi" 
    });
  }
}
