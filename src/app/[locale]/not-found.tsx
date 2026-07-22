import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/10 px-4 text-center">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
        <Search className="w-12 h-12" />
      </div>
      <h1 className="text-6xl font-black text-foreground mb-4">404</h1>
      <h2 className="text-2xl font-bold text-foreground mb-3">Sahifa topilmadi</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Siz qidirayotgan sahifa o'chirilgan, nomi o'zgargan yoki vaqtincha mavjud emas bo'lishi mumkin.
      </p>
      <Link
        href="/"
        className="bg-primary text-white px-8 py-3.5 rounded-full font-bold hover:bg-primary/90 transition-all shadow-xl flex items-center gap-2 touch-target"
      >
        <ArrowLeft className="w-5 h-5" />
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
}
