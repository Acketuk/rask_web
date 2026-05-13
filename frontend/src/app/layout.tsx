import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { Suspense } from "react";
import Header from "@/components/ui/Header";
import Main from "@/components/ui/Main";
import Footer from "@/components/ui/Footer";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rask",
  description: "Rask marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <Main>{children}</Main>
        <Suspense>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
