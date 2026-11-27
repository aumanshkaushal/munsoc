import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const siteUrl = "https://munsoc.opensourcenitj.com";
const siteName = "MUNSoC NITJ";
const title = `${siteName} | Model United Nations Society`;
const description = "The Model United Nations Society at NIT Jalandhar. Browse past events and see what’s next.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s | ${siteName}` },
  description,
  applicationName: siteName,
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName,
    title,
    description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: siteName }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#f8f6ef", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <div className="grow">{children}</div>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteName,
          alternateName: "Model United Nations Society NIT Jalandhar",
          url: siteUrl,
          logo: `${siteUrl}/icon-512.png`,
        }) }} />
      </body>
    </html>
  );
}
