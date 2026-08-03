import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import Header from "@/components/ui/Header";
import Main from "@/components/ui/Main";
import Footer from "@/components/ui/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./globals.css";

const satoshi = localFont({
  src: [
    { path: "../../public/fonts/Satoshi-Variable.woff2", style: "normal" },
    { path: "../../public/fonts/Satoshi-VariableItalic.woff2", style: "italic" },
  ],
  variable: "--font-satoshi",
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
      className={`${satoshi.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <LanguageProvider>
          <AuthProvider>
            <Header />
            <Main>{children}</Main>
            <Suspense>
              <Footer />
            </Suspense>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
