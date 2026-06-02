import { cacheLife } from "next/cache";
import Link from "next/link";
import {
  Briefcase, Camera, Sparkles, Home, Zap, ShoppingBag, Car,
  BookOpen, Dumbbell, Wrench, Armchair, Baby, PawPrint, Palette,
  UtensilsCrossed, Music, Building2, Gamepad2, Plane, LayoutGrid,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  level: number;
  parent_id: string | null;
};

const ICON_MAP: Record<string, React.ElementType> = {
  "Jobs & Services": Briefcase,
  "Photography & Video": Camera,
  "Health & Beauty": Sparkles,
  "Real Estate": Home,
  "Electronics": Zap,
  "Clothing & Apparel": ShoppingBag,
  "Vehicles": Car,
  "Books & Education": BookOpen,
  "Sports & Outdoors": Dumbbell,
  "Garden & Tools": Wrench,
  "Furniture": Armchair,
  "Baby & Kids": Baby,
  "Pets & Animals": PawPrint,
  "Art & Collectibles": Palette,
  "Food & Beverages": UtensilsCrossed,
  "Music & Instruments": Music,
  "Office & Business": Building2,
  "Toys & Games": Gamepad2,
  "Travel & Experiences": Plane,
  "Other": LayoutGrid,
};

const TILE_COLORS = [
  "bg-indigo-600 text-white hover:bg-indigo-700",
  "bg-violet-600 text-white hover:bg-violet-700",
  "bg-blue-600  text-white hover:bg-blue-700",
  "bg-cyan-600  text-white hover:bg-cyan-700",
  "bg-teal-600  text-white hover:bg-teal-700",
  "bg-green-600 text-white hover:bg-green-700",
  "bg-amber-500 text-white hover:bg-amber-600",
  "bg-orange-500 text-white hover:bg-orange-600",
  "bg-rose-600  text-white hover:bg-rose-700",
  "bg-pink-600  text-white hover:bg-pink-700",
];

async function fetchCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("days");
  try {
    const res = await fetch(`${process.env.API_URL}/api/v1/categories`);
    if (!res.ok) return [];
    return (await res.json()) ?? [];
  } catch {
    return [];
  }
}

export default async function CategoryGrid({ compact = false }: { compact?: boolean }) {
  const categories = await fetchCategories();
  const roots = categories.filter((c) => c.parent_id === null);

  if (roots.length === 0) return null;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {roots.map((cat) => (
          <Link
            key={cat.id}
            href={`/ads/category/${cat.id}`}
            className="rounded-full border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:border-primary/40"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {roots.map((cat, i) => {
        const Icon = ICON_MAP[cat.name] ?? LayoutGrid;
        const color = TILE_COLORS[i % TILE_COLORS.length];
        return (
          <Link
            key={cat.id}
            href={`/ads/category/${cat.id}`}
            className={`flex flex-col items-center gap-3 rounded-2xl px-4 py-7 text-center transition-all duration-150 hover:scale-[1.03] hover:shadow-md ${color}`}
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-white/20">
              <Icon className="size-5" />
            </div>
            <span className="text-sm font-semibold leading-tight">{cat.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
