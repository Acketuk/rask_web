"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Mail, Phone, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import AdCard, { type Ad } from "@/components/ui/AdCard";
import { CATEGORY_GRADIENTS, FALLBACK_GRADIENT } from "@/lib/categoryMeta";

const API = process.env.NEXT_PUBLIC_API_URL;

type Profile = {
  id: string;
  name: string;
  email: string;
  phone_number: { String: string; Valid: boolean } | null;
  created_at: { Time: string; Valid: boolean } | null;
};

export default function ProfilePage() {
  const { user, accessToken, isLoggedIn } = useAuth();
  const router = useRouter();

  const [profile,  setProfile]  = useState<Profile | null>(null);
  const [ads,      setAds]      = useState<Ad[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !accessToken || !user?.id) {
      router.replace("/sign-in");
      return;
    }

    Promise.all([
      fetch(`${API}/api/v1/users/${user.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then(r => r.ok ? r.json() : null),
      fetch(`${API}/api/v1/ads/user/${user.id}?limit=50`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then(r => r.ok ? r.json() : []),
    ]).then(([prof, userAds]) => {
      setProfile(prof);
      setAds(Array.isArray(userAds) ? userAds : []);
      setLoading(false);
    });
  }, [isLoggedIn, accessToken, user, router]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Loading profile…
      </div>
    );
  }

  if (!profile) return null;

  const initials = profile.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const gradient = ads[0] ? (CATEGORY_GRADIENTS[ads[0].category_id] ?? FALLBACK_GRADIENT) : FALLBACK_GRADIENT;
  const joined   = profile.created_at?.Valid
    ? new Date(profile.created_at.Time).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : null;

  return (
    <div className="flex flex-col gap-10">

      {/* Profile card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Colour banner */}
        <div className="h-28 w-full" style={{ background: gradient }} />

        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div
            className="-mt-10 mb-4 flex size-20 items-center justify-center rounded-2xl border-4 border-card text-2xl font-black text-white shadow-md"
            style={{ background: gradient }}
          >
            {initials}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-2xl font-black">{profile.name}</h1>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3.5 shrink-0" />
                  {profile.email}
                </span>
                {profile.phone_number?.Valid && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="size-3.5 shrink-0" />
                    {profile.phone_number.String}
                  </span>
                )}
                {joined && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 shrink-0" />
                    Joined {joined}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 shrink-0" />
                  Lithuania
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="rounded-xl border border-border px-4 py-2 text-center">
                <p className="text-xl font-black">{ads.length}</p>
                <p className="text-xs text-muted-foreground">Listing{ads.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">My Listings</h2>
          <Link
            href="/ads/post"
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <PlusCircle className="size-4" />
            Post a Service
          </Link>
        </div>

        {ads.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border text-center">
            <p className="font-semibold">No listings yet</p>
            <p className="text-sm text-muted-foreground">Post your first service to start earning.</p>
            <Link
              href="/ads/post"
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Post a Service
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ads.map(ad => <AdCard key={ad.id} ad={ad} />)}
          </div>
        )}
      </section>

    </div>
  );
}
