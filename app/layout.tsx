import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://webp.giw.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "WebP Converter - Free Online Image to WebP Converter",
    template: "%s | WebP Converter",
  },
  description:
    "Convert JPG, PNG, GIF, and other images to WebP format instantly in your browser. 100% free, no uploads required, fully client-side with quality and size controls.",
  keywords: [
    "webp converter",
    "image converter",
    "png to webp",
    "jpg to webp",
    "jpeg to webp",
    "gif to webp",
    "bmp to webp",
    "online converter",
    "free image converter",
    "browser image converter",
    "client-side converter",
    "image compression",
    "webp format",
    "image optimization",
  ],
  authors: [{ name: "WebP Converter" }],
  creator: "WebP Converter",
  publisher: "WebP Converter",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "WebP Converter",
    title: "WebP Converter - Free Online Image to WebP Converter",
    description:
      "Convert JPG, PNG, GIF, and other images to WebP format instantly in your browser. 100% free, no uploads, fully private.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WebP Converter - Convert images to WebP format",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WebP Converter - Free Online Image to WebP Converter",
    description:
      "Convert JPG, PNG, GIF, and other images to WebP format instantly in your browser. 100% free, no uploads, fully private.",
    images: ["/og-image.png"],
    creator: "@webpconverter",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f0f0f" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WebP Converter",
  url: siteUrl,
  description:
    "Convert JPG, PNG, GIF, and other images to WebP format instantly in your browser. 100% free, no uploads required.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript. Requires HTML5 Canvas support.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Convert images to WebP format",
    "Adjust image quality",
    "Resize images",
    "Batch conversion",
    "Download as ZIP",
    "100% client-side processing",
    "No file uploads to servers",
    "Privacy-friendly",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
