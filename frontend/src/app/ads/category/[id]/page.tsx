import { cacheLife } from "next/cache";
import CategoryPageContent from "@/components/ui/CategoryPageContent";
import { CATEGORY_GRADIENTS, FALLBACK_GRADIENT } from "@/lib/categoryMeta";
import type { Ad } from "@/components/ui/AdCard";

const PER_PAGE = 25;

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

async function fetchAdsByCategory(categoryId: string, page: number): Promise<Ad[]> {
  const offset = (page - 1) * PER_PAGE;
  try {
    const res = await fetch(
      `${process.env.API_URL}/api/v1/ads/category/${categoryId}?limit=${PER_PAGE}&offset=${offset}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return (await res.json()) ?? [];
  } catch {
    return [];
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const [categories, ads] = await Promise.all([
    fetchCategories(),
    fetchAdsByCategory(id, page),
  ]);

  const current  = categories.find((c) => c.id === id);
  const subs     = categories.filter((c) => c.parent_id === id);
  const gradient = current ? (CATEGORY_GRADIENTS[current.name] ?? FALLBACK_GRADIENT) : FALLBACK_GRADIENT;

  const hasMore   = ads.length === PER_PAGE;
  const base      = `/ads/category/${id}`;
  const prevHref  = page > 1 ? `${base}?page=${page - 1}` : base;
  const nextHref  = `${base}?page=${page + 1}`;

  return (
    <CategoryPageContent
      currentCategory={current}
      subCategories={subs}
      ads={ads}
      page={page}
      hasMore={hasMore}
      prevHref={prevHref}
      nextHref={nextHref}
      gradient={gradient}
    />
  );
}
