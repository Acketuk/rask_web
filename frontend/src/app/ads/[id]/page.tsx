import { notFound } from "next/navigation";
import AdDetailContent from "@/components/ui/AdDetailContent";
import { CATEGORY_GRADIENTS, FALLBACK_GRADIENT } from "@/lib/categoryMeta";

type Ad = {
  id: string;
  title: string;
  description: string;
  price: number;
  created_at: { Time: string; Valid: boolean } | null;
  category_id: string;
  user_id: string;
  attributes: {
    location?: string;
    provider?: string;
    delivery?: string;
    availability?: string;
    image?: string;
  } | null;
};

type Category = { id: string; name: string; level: number; parent_id: string | null };

async function fetchAd(id: string): Promise<Ad | null> {
  try {
    const res = await fetch(`${process.env.API_URL}/api/v1/ads/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.API_URL}/api/v1/categories`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function formatDate(ts: { Time: string; Valid: boolean } | null) {
  if (!ts?.Valid) return null;
  return new Date(ts.Time).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function AdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [ad, categories] = await Promise.all([fetchAd(id), fetchCategories()]);
  if (!ad) notFound();

  const category = categories.find(c => c.id === ad.category_id);
  const parent   = category?.parent_id ? categories.find(c => c.id === category.parent_id) : undefined;
  const gradient = CATEGORY_GRADIENTS[category?.name ?? ""] ?? FALLBACK_GRADIENT;
  const date     = formatDate(ad.created_at);

  return (
    <AdDetailContent
      ad={ad}
      category={category}
      parent={parent}
      gradient={gradient}
      date={date}
    />
  );
}
