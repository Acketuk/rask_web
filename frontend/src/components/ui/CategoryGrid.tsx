import { cacheLife } from "next/cache";
import Link from "next/link";
import Animate from "@/components/ui/Animate";
import {
  Armchair,
  Bike,
  BookOpen,
  Car,
  Cpu,
  Dumbbell,
  Home,
  Leaf,
  Package,
  PawPrint,
  Shirt,
  Smartphone,
  Sofa,
  Wrench,
  type LucideIcon,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  level: number;
  parent_id: string | null;
};

const iconMap: Record<string, LucideIcon> = {
  electronics: Cpu,
  vehicles: Car,
  furniture: Sofa,
  fashion: Shirt,
  sports: Dumbbell,
  "real estate": Home,
  services: Wrench,
  books: BookOpen,
  garden: Leaf,
  pets: PawPrint,
  bikes: Bike,
  phones: Smartphone,
  armchairs: Armchair,
};

function categoryIcon(name: string): LucideIcon {
  return iconMap[name.toLowerCase()] ?? Package;
}

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

export default async function CategoryGrid() {
  const categories = await fetchCategories();
  const roots = categories.filter((c) => c.parent_id === null);

  if (roots.length === 0) return null;

  return (
    <section className="mx-auto max-w-300">
      <h2 className="mb-4 text-2xl font-semibold text-black">Browse by category</h2>
      <Animate stagger scale={0.9} y={12} duration={0.9} staggerDelay={0.04} className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {roots.map((category) => {
          const Icon = categoryIcon(category.name);
          return (
            <Link
              key={category.id}
              href={`/ads?category=${category.id}`}
              className="group flex aspect-square flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card transition-all hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm dark:hover:border-blue-800 dark:hover:bg-blue-950/20"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40">
                <Icon className="size-3.5 text-muted-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </div>
              <span className="text-center text-[12px] font-normal leading-tight">
                {category.name}
              </span>
            </Link>
          );
        })}
      </Animate>
    </section>
  );
}
