import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Global/Header/Header";
import Footer from "@/components/Global/Footer/Footer";
import LenisScrollProvider from "@/providers/lenis-providers";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next"

export const dynamic = 'force-dynamic'; // Force revalidation on every request

export const metadata: Metadata = {
  title: {
    template: '%s | Music For Pennies',
    default: 'Music For Pennies', 
  },  
  description: "Inte den vanliga sortens skivbolag...",

  metadataBase: new URL('https://musicforpennies.se'),
  openGraph: {
    title: 'Music For Pennies',
    description: "Inte den vanliga sortens skivbolag...",
    url: 'https://musicforpennies.se',
    siteName: 'Music For Pennies',
    images: [
      {
        url: 'https://musicforpennies.se/api', // Must be an absolute URL
        width: 800,
        height: 600,
      },

    ],
    locale: 'sv_SE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'wwww.musicforpennies.se',
    description: "Inte den vanliga sortens skivbolag...",
    images: ['https://musicforpennies.se/api',], // Must be an absolute URL
  },

};

export default function RootLayout({ children,}: Readonly<{children: React.ReactNode;}>) {
  
  return (
    <html lang="se_SV">
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
