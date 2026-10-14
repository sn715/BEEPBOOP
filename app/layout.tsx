import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Space_Mono } from "next/font/google";
import { siteConfig } from "@/lib/config";
import "./globals.css";

// Alte Haas Grotesk is self-hosted from public/fonts (see app/globals.css)
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono" });

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
    <html lang="en" className={spaceMono.variable} suppressHydrationWarning>
      <head>
        {/* Marks JS as available so scroll effects only hide content when they can show it again */}
        <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.add("js");' }} />
      </head>
      {/* Browser extensions (Grammarly, ColorZilla, …) add attributes to <body> before React loads */}
      <body suppressHydrationWarning>
        {children}
        {/* Google Analytics: production builds only, so local dev visits don't count */}
        {process.env.NODE_ENV === "production" && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.gaMeasurementId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${siteConfig.gaMeasurementId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
