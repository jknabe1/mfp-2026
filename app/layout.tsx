import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Global/Header/Header";
import Footer from "@/components/Global/Footer/Footer";
import LenisScrollProvider from "@/providers/LenisProvider";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next"

export const dynamic = 'force-dynamic'; // Force revalidation on every request

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ffffff',
  colorScheme: 'light',
};

export const metadata: Metadata = {
  title: {
    template: '%s | Music For Pennies',
    default: 'Music For Pennies', 
  },  
  description: "Inte den vanliga sortens skivbolag. Musikproduktion, evenemang och artiststöd från Music For Pennies.",
  keywords: ['musik', 'skivbolag', 'konserter', 'evenemang', 'Örebro', 'artiststöd'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://musicforpennies.se'),
  alternates: {
    canonical: 'https://musicforpennies.se',
  },
  openGraph: {
    title: 'Music For Pennies',
    description: "Inte den vanliga sortens skivbolag. Musikproduktion, evenemang och artiststöd.",
    url: 'https://musicforpennies.se',
    siteName: 'Music For Pennies',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Music For Pennies - Musikproduktion och evenemang',
        type: 'image/jpeg',
      },
    ],
    locale: 'sv_SE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Music For Pennies',
    description: "Inte den vanliga sortens skivbolag. Musikproduktion, evenemang och artiststöd.",
    images: ['https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop'],
    creator: '@musicforpennies',
  },
};

export default function RootLayout({ children,}: Readonly<{children: React.ReactNode;}>) {
  
  return (
    <html lang="sv">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased">
        <Header/>  
          <LenisScrollProvider>
            {children}
            <SpeedInsights/>
            <Analytics />
          </LenisScrollProvider>
        <Footer />
      </body>
    </html>
  );
}
