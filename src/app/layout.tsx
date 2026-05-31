import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const mozillaHeadline = localFont({
  src: "./fonts/Mozilla_Headline/MozillaHeadline-VariableFont_wdth,wght.ttf",
  variable: "--font-mozilla",
});

export const metadata: Metadata = {
  title: "SolarWave | GES",
  description: "Modern Solar Dashboard",
  creator: "ARC AI",
  publisher: "ARC AI",
  authors: [{ name: "ARC AI", url: "https://www.arcai.agency" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} ${outfit.variable} ${mozillaHeadline.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "GES (PVT) LTD",
              "url": "https://ges.lk",
              "creator": {
                "@type": "Organization",
                "name": "ARC AI",
                "url": "https://www.arcai.agency",
                "sameAs": [
                  "https://www.arcai.agency"
                ],
                "description": "Premium AI Automation and Software Company specializing in custom AI workflows and enterprise software development."
              }
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}
