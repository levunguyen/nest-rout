import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Genealogy Dashboard",
  description: "Family Tree Dashboard UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex">

        <div className="flex-1 flex flex-col min-h-screen">
          <main className="flex-1 p-6 bg-gray-50">
            {children}
          </main>
          <Footer />   {/* 👈 Footer nằm ở đây */}
        </div>
      </body>
    </html>
  );
}
