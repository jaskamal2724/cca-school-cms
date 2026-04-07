import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import { outfit } from "@/font";


export const metadata: Metadata = {
  title: "CCA CMS",
  description: "Content Management System for CCA School",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.className}>
      <body className={`flex min-h-screen text-slate-900`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
