import EmployeeGrid from '@/components/Contact/EmployeeGrid'
import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image';


// ✅ Static Metadata
export const metadata: Metadata = {
  title: "Kontakta oss",
  description: "Kontakta oss på Music For Pennies. Här hittar du kontaktuppgifter till föreningen, press, ekonomi, och våra medarbetare.",
  openGraph: {
    title: "Kontakta oss - Music For Pennies",
    description: "Behöver du nå oss? Här hittar du kontaktuppgifter till Music For Pennies.",
    url: "https://musicforpennies.se/om-oss/kontakta-oss",
    siteName: "Music For Pennies",
    images: [
      {
        url: "https://musicforpennies.se/api",
        width: 1200,
        height: 800,
        alt: "Music For Pennies Kontakt",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kontakta oss - Music For Pennies",
    description: "Behöver du nå oss? Här hittar du kontaktuppgifter till Music For Pennies.",
    images: ["https://musicforpennies.se/api"],
  },
};


export default function page() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Kontakta oss  - Music For Pennies",
        "description": "Kontaktuppgifter till Music For Pennies.",
        "url": "https://musicforpennies.se/om-oss/kontakta-oss",
        "image": "https://musicforpennies.se/api",
        "publisher": {
          "@type": "Organization",
          "name": "Music For Pennies",
          "url": "https://musicforpennies.se"
        },
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "contactType": "Föreningen",
            "email": "halloj@kkrecords.se"
          },
          {
            "@type": "ContactPoint",
            "contactType": "Ordförande",
            "email": "nerim.mehmedovic@kf019.se"
          },
          {
            "@type": "ContactPoint",
            "contactType": "Press",
            "email": "jens.knabe@kkrecords.se"
          },
          {
            "@type": "ContactPoint",
            "contactType": "Ekonomi",
            "email": "elliot.bergdahl@kf019.se"
          },
          {
            "@type": "ContactPoint",
            "contactType": "Music For Pennies",
            "email": "tjooo@musicforpennies.se"
          }
        ]
      };
    
  return (
    <div>
        <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="grid grid-cols-12 gap-px ">
            <div className="col-span-12 relative h-full grid-col-border">
                <div className="grid grid-cols-12 gap-px items-start">
                    <div className="col-span-12 lg:col-span-6 grid-col-border">
                        <ul className="flex flex-col gap-px">
                            <li className="grid-col-border  px-2 py-3 lg:px-5">
                                <h2 className="text-sans-35 lg:text-sans-60 font-600">Föreningen</h2>
                                <div className="rich-text text-sans-22 lg:text-sans-30 rich-text-light line-break">
                                    <p>halloj@kkrecords.se</p>
                                </div>
                            </li>
                            <li className="grid-col-border px-2 py-3 lg:px-5">
                                <h2 className="text-sans-35 lg:text-sans-60 font-600">Ordförande</h2>
                                <div className="rich-text text-sans-22 lg:text-sans-30 rich-text-light line-break">
                                    <p>nerim.mehmedovic@kf019.se</p>
                                </div>
                            </li>
                            <li className="grid-col-border px-2 py-3 lg:px-5">
                                <h2 className="text-sans-35 lg:text-sans-60 font-600">Press</h2>
                                <div className="rich-text text-sans-22 lg:text-sans-30 rich-text-light line-break">
                                    <p>jens.knabe@kkrecords.se</p>
                                </div>
                            </li>
                            <li className="grid-col-border px-2 py-3 lg:px-5">
                                <h2 className="text-sans-35 lg:text-sans-60 font-600">Ekonomi</h2>
                                <div className="rich-text text-sans-22 lg:text-sans-30 rich-text-light line-break">
                                    <p>elliot.bergdahl@kf019.se</p>
                                </div>
                            </li>
                            <li className="grid-col-border px-2 py-3 lg:px-5">
                                <h2 className="text-sans-35 lg:text-sans-60 font-600">Music For Pennies</h2>
                                <div className="rich-text text-sans-22 lg:text-sans-30 rich-text-light line-break">
                                    <p>tjooo@musicforpennies.se</p>
                                </div>
                            </li>
                            <li className="grid-col-border px-2 py-3 lg:px-5 ">
                            <div className="flex items-center gap-2">
                                <h2 className="text-sans-35 lg:text-sans-60 font-600">Direktkontakt</h2>
                                <svg xmlns="http://www.w3.org/2000/svg" className='top-0' width="32" height="32" fill="#000000" viewBox="0 0 256 256">
                                    <path d="M229.66,165.66l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L168,188.69V72H32a8,8,0,0,1,0-16H176a8,8,0,0,1,8,8V188.69l34.34-34.35a8,8,0,0,1,11.32,11.32Z"></path>
                                </svg>
                            </div>
                            </li>
                        </ul>
                    </div>
                    <div className="hidden lg:block col-span-6 grid-col-border sticky top-7 min-h-hero-minus-header overflow-hidden">
                        <div className="image overflow-hidden absolute inset-0">
                                <Image 
                                className="noise grayscale object-cover object-center w-full h-full"
                                loading="lazy"
                                width={1080}
                                height={1080}
                                sizes="100vw" 
                                src="https://images.unsplash.com/photo-1659455741342-c623b151a62b?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                                alt="Guitar collection"/>
                        </div>
                </div>
            </div>
          </div>
        </div>
        <EmployeeGrid />
    </div>
  )
}
