import { cacheLife } from "next/cache";
import Link from "next/link";
import { ChevronRight, LayoutGrid } from "lucide-react";
import AdCard, { type Ad } from "@/components/ui/AdCard";
import { CATEGORY_ICONS, CATEGORY_GRADIENTS, FALLBACK_GRADIENT } from "@/lib/categoryMeta";

type Category = { id: string; name: string; level: number; parent_id: string | null };

// ─── Data fetching ─────────────────────────────────────────────────────────

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

async function fetchAdsByCategory(categoryId: string): Promise<Ad[]> {
  "use cache";
  cacheLife("minutes");
  try {
    const res = await fetch(
      `${process.env.API_URL}/api/v1/ads/category/${categoryId}?limit=50`
    );
    if (!res.ok) return [];
    return (await res.json()) ?? [];
  } catch {
    return [];
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [categories, ads] = await Promise.all([
    fetchCategories(),
    fetchAdsByCategory(id),
  ]);

  const current  = categories.find((c) => c.id === id);
  const subs     = categories.filter((c) => c.parent_id === id);
  const gradient = current ? (CATEGORY_GRADIENTS[current.name] ?? FALLBACK_GRADIENT) : FALLBACK_GRADIENT;

  return (
    <div className="flex flex-col gap-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/ads" className="hover:text-foreground transition-colors">
          Browse
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-foreground">{current?.name ?? "Category"}</span>
      </nav>

      {/* Hero banner */}
      <div
        className="flex items-end rounded-2xl p-8 min-h-36"
        style={{ background: gradient }}
      >
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-white/70">Category</p>
          <h1 className="text-3xl font-black text-white">{current?.name ?? "Category"}</h1>
          {ads.length > 0 && (
            <p className="mt-1 text-sm text-white/70">
              {ads.length} service{ads.length !== 1 ? "s" : ""} available
            </p>
          )}
        </div>
      </div>

      {/* Sub-categories */}
      {subs.length > 0 && (
        <section>
          <h2 className="mb-3 text-base font-semibold">Sub-categories</h2>
          <div className="flex flex-wrap gap-2">
            {subs.map((sub) => {
              const Icon = CATEGORY_ICONS[sub.name] ?? LayoutGrid;
              const grad = CATEGORY_GRADIENTS[sub.name] ?? gradient;
              return (
                <Link
                  key={sub.id}
                  href={`/ads/category/${sub.id}`}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-all hover:border-transparent hover:shadow-md hover:-translate-y-0.5"
                  style={{ ["--hover-bg" as string]: grad }}
                >
                  <span
                    className="flex size-5 items-center justify-center rounded-full text-white"
                    style={{ background: grad }}
                  >
                    <Icon className="size-3" />
                  </span>
                  {sub.name}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Ads */}
      <section>
        {subs.length > 0 && (
          <h2 className="mb-4 text-base font-semibold">
            All services in {current?.name}
          </h2>
        )}
        {ads.length === 0 ? (
          <div className="flex h-52 items-center justify-center rounded-2xl border-2 border-dashed border-border text-sm text-muted-foreground">
            No services in this category yet
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
