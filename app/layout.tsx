import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { generateMetadata, generateViewport, generateOrganizationSchema, generateLocalBusinessSchema } from "@/lib/seo";
import { logEnvironmentStatus } from "@/lib/env-validation";
if (typeof window === 'undefined') {
  logEnvironmentStatus();
}
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});
export const metadata: Metadata = generateMetadata({
  title: "Professional Interior Designer & Construction Services in Islamabad | Rawalpindi",
  description: "Expert interior design and construction services in Islamabad & Rawalpindi. Specializing in false ceilings, texture coating, wooden flooring, window blinds, and complete interior solutions for homes, offices, hotels & restaurants. Quality craftsmanship with 10+ years experience.",
  keywords: [
    "interior designer Islamabad",
    "construction company Islamabad", 
    "interior design Rawalpindi",
    "false ceiling contractor Islamabad",
    "office interior design Islamabad",
    "texture coating Islamabad",
    "wooden flooring Pakistan",
    "window blinds Islamabad",
    "home interiors Pakistan",
    "commercial interior design"
  ],
  url: "/",
});
export const viewport = generateViewport();
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();
  const localBusinessSchema = generateLocalBusinessSchema();
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#C9A66B" />
        <meta name="msapplication-TileColor" content="#C9A66B" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground" suppressHydrationWarning>
        {}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
