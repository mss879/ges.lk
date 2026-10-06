import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { site, SITE_URL } from "@/lib/site";
import { OG_BASE } from "@/lib/seo/metadata";
import ChatMount from "@/components/chat/ChatMount";

// Both are variable fonts: one file each covers every weight the site uses.
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: site.defaultTitle,
    template: `%s | ${site.titleSuffix}`,
  },
  description: site.description,
  applicationName: OG_BASE.siteName,
  authors: [{ name: site.legalName, url: SITE_URL }],
  creator: site.creator.name,
  publisher: site.legalName,
  category: "Solar energy",
  openGraph: {
    ...OG_BASE,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#04140B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} ${outfit.variable} font-sans antialiased`}>
        {children}
        <ChatMount />
      </body>
    </html>
  );
}
