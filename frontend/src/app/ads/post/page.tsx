"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";

type Category = { id: string; name: string; level: number; parent_id: string | null };

const DELIVERIES = ["Same day", "Next day", "1–2 days", "2–3 days", "3–5 days", "Within a week", "By appointment"];
const AVAILABILITY = ["Weekdays", "Weekends", "Evenings", "Mon–Fri", "Flexible", "24/7", "By appointment"];
const CITIES = ["Vilnius", "Kaunas", "Klaipėda", "Šiauliai", "Panevėžys", "Alytus", "Marijampolė", "Utena", "Druskininkai", "Remote"];

export default function PostAdPage() {
  const { isLoggedIn, user, accessToken } = useAuth();
  const router = useRouter();

  const [categories, setCategories]   = useState<Category[]>([]);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category_id: "",
    location: "",
    provider: "",
    delivery: "",
    availability: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (isLoggedIn === false) router.replace("/sign-in");
  }, [isLoggedIn, router]);

  // Pre-fill provider with user name
  useEffect(() => {
    if (user) setForm(f => ({ ...f, provider: user.name }));
  }, [user]);

  // Fetch categories
  useEffect(() => {
    fetch("/api/v1/categories")
      .then(r => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.description.trim() || !form.category_id) {
      setError("Title, description, and category are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title:        form.title.trim(),
          description:  form.description.trim(),
          price:        parseInt(form.price) || 0,
          category_id:  form.category_id,
          location:     form.location,
          provider:     form.provider,
          delivery:     form.delivery,
          availability: form.availability,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to post ad");
      }

      const ad = await res.json();
      router.push(`/ads/${ad.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  // Build grouped subcategory list
  const roots = categories.filter(c => c.level === 0);
  const subs  = categories.filter(c => c.level === 1);

  if (!isLoggedIn) return null;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="size-3.5" />
        <Link href="/ads" className="hover:text-foreground transition-colors">Browse</Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-foreground">Post a Service</span>
      </nav>

      <h1 className="mb-8 text-2xl font-black">Post a service</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">

        {/* Basic info */}
        <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold">Basic information</h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Title <span className="text-destructive">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={e => set("title", e.target.value)}
              placeholder="e.g. Professional Home Cleaning Service"
              maxLength={120}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <p className="text-xs text-muted-foreground">{form.title.length}/120</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Description <span className="text-destructive">*</span></label>
            <textarea
              value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Describe your service in detail — what's included, your experience, and why customers should choose you."
              rows={5}
              maxLength={1000}
              className="resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <p className="text-xs text-muted-foreground">{form.description.length}/1000</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Price (€)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={e => set("price", e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-8 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </section>

        {/* Category */}
        <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold">Category <span className="text-destructive">*</span></h2>
          <select
            value={form.category_id}
            onChange={e => set("category_id", e.target.value)}
            className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">Select a sub-category…</option>
            {roots.map(root => {
              const children = subs.filter(s => s.parent_id === root.id);
              if (!children.length) return null;
              return (
                <optgroup key={root.id} label={root.name}>
                  {children.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </section>

        {/* Details */}
        <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold">Details</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Your name / business</label>
              <input
                type="text"
                value={form.provider}
                onChange={e => set("provider", e.target.value)}
                placeholder="e.g. Tomas Cleaning Co."
                className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Location</label>
              <select
                value={form.location}
                onChange={e => set("location", e.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Select city…</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Delivery time</label>
              <select
                value={form.delivery}
                onChange={e => set("delivery", e.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Select…</option>
                {DELIVERIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Availability</label>
              <select
                value={form.availability}
                onChange={e => set("availability", e.target.value)}
                className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Select…</option>
                {AVAILABILITY.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
        </section>

        {error && (
          <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          {submitting && <Loader2 className="size-4 animate-spin" />}
          {submitting ? "Posting…" : "Post service"}
        </button>
      </form>
    </div>
  );
}
