import { cacheLife } from "next/cache";
import CategoryGridClient from "@/components/ui/CategoryGridClient";

type Category = {
  id: string;
  name: string;
  level: number;
  parent_id: string | null;
};

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
  return <CategoryGridClient categories={categories} compact={compact} />;
}
