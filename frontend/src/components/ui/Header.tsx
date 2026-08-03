"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import Logo from "@/components/ui/Logo";
import FavoritesLink from "@/components/ui/FavoritesLink";
import ChatIcon from "@/components/ui/ChatIcon";
import UserMenu from "@/components/ui/UserMenu";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-15 max-w-7xl items-center gap-4 px-6">
        <Link href="/" aria-label="Rask home" className="shrink-0 mr-2">
          <Logo />
        </Link>

      

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/ads/post"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
          >
            <Plus className="size-4" strokeWidth={2.5} />
            {t.postService}
          </Link>

          <div className="h-5 w-px bg-border mx-1 hidden sm:block" />

          <LanguageSelector />
          <FavoritesLink />
          <ChatIcon />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
