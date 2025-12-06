import type { Metadata } from "next";

import Footer from "../../components/Footer";

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

        </div>
      </body>
    </html>
  );
}
