import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Project LOOP — AI Customer-Feedback Intelligence Platform",
  description: "Enterprise multi-tenant customer feedback intelligence platform with role-based access control, AI classification, grounded RAG Q&A, and Voice-of-Customer reports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} antialiased text-slate-900 bg-slate-50 min-h-screen selection:bg-indigo-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
