import { cacheLife } from "next/cache";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { CATEGORY_ICONS, CATEGORY_GRADIENTS, FALLBACK_GRADIENT } from "@/lib/categoryMeta";

type Category = { id: string; name: string; level: number; parent_id: string | null };

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

async function fetchAdCount(): Promise<number> {
  "use cache";
  cacheLife("minutes");
  try {
    const res = await fetch(`${process.env.API_URL}/api/v1/ads/count`);
    if (!res.ok) return 0;
    const data = await res.json();
    return typeof data?.count === "number" ? data.count : 0;
  } catch {
    return 0;
  }
}

export default async function AdsPage() {
  const [categories, adCount] = await Promise.all([fetchCategories(), fetchAdCount()]);
  const roots = categories.filter((c) => c.parent_id === null);

  const subMap = new Map<string, Category[]>();
  for (const cat of categories) {
    if (cat.parent_id) {
      const arr = subMap.get(cat.parent_id) ?? [];
      arr.push(cat);
      subMap.set(cat.parent_id, arr);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Browse Services</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {adCount > 0
            ? `${adCount} service${adCount !== 1 ? "s" : ""} available across ${roots.length} categories`
            : "Choose a category to explore available services"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {roots.map((cat) => {
          const Icon  = CATEGORY_ICONS[cat.name] ?? LayoutGrid;
          const grad  = CATEGORY_GRADIENTS[cat.name] ?? FALLBACK_GRADIENT;
          const subs  = subMap.get(cat.id) ?? [];
          const shown = subs.slice(0, 3);
          const extra = subs.length - shown.length;

          return (
            <Link
              key={cat.id}
              href={`/ads/category/${cat.id}`}
              className="group overflow-hidden rounded-2xl shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className="relative flex aspect-4/3 w-full flex-col justify-between p-4"
                style={{ background: grad }}
              >
                {/* Icon — top right */}
                <div className="flex justify-end">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-white/20 text-white">
                    <Icon className="size-4" />
                  </div>
                </div>

                {/* Name + sub-categories — bottom */}
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold leading-tight text-white">
                    {cat.name}
                  </p>
                  {shown.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {shown.map((s) => (
                        <span key={s.id} className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white">
                          {s.name}
                        </span>
                      ))}
                      {extra > 0 && (
                        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white">
                          +{extra} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
