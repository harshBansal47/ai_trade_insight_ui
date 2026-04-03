import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";

import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import Providers from "@/providers/Providers";
const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});
export const metadata: Metadata = {
  title: {
    default: "CryptoAI Insights — AI-Powered Crypto Analysis",
    template: "%s | CryptoAI Insights",
  },
  description:
    "Real-time AI-powered crypto trading analysis. Get structured LONG / SHORT / WAIT decisions for Bitcoin, Ethereum and 20+ coins.",
  keywords: ["crypto", "AI", "trading", "bitcoin", "ethereum", "analysis", "signals"],
  authors: [{ name: "CryptoAI Insights" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "CryptoAI Insights",
    description: "AI-Powered Crypto Trading Analysis Platform",
    siteName: "CryptoAI Insights",
  },
  twitter: {
    card: "summary_large_image",
    title: "CryptoAI Insights",
    description: "AI-Powered Crypto Trading Analysis Platform",
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#00D4FF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            richColors
            expand={false}
            toastOptions={{
              style: {
                background:  "hsl(220 18% 9%)",
                border:      "1px solid hsl(220 15% 18%)",
                color:       "hsl(210 20% 96%)",
                fontFamily:  "var(--font-sans)",
                borderRadius:"12px",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
