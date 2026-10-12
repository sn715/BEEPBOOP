import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  openGraph: { title: siteConfig.title, description: siteConfig.description },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Marks JS as available so scroll effects only hide content when they can show it again */}
        <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.add("js");' }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
