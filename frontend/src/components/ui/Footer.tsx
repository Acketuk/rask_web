"use client";

export default function Footer() {
  return (
    <footer className="mt-16 w-full border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="font-black text-foreground">
            rask<span className="text-primary">.</span>
          </span>
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <nav className="flex items-center gap-6">
          <a href="/privacy" className="transition hover:text-foreground">Privacy</a>
          <a href="/terms" className="transition hover:text-foreground">Terms</a>
          <a href="/contact" className="transition hover:text-foreground">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
