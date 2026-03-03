import LoginForm from '@/components/Backstage/login-form'
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Backstage",
  description: "Access your Music For Pennies account. Log in securely to manage your profile, music, and more.",
  robots: "noindex, nofollow", // Prevents search engines from indexing the login page
  openGraph: {
    title: "Backstage - Music For Pennies",
    description: "Sign in to access your Music For Pennies account.",
    url: "https://musicforpennies.se/backstage",
    siteName: "Backstage - Music For Pennies",
    images: [
      {
        url: "https://musicforpennies.se/api",
        width: 1200,
        height: 630,
        alt: "Backstage - Music For Pennies",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Backstage - Music For Pennies",
    description: "Backstage - Music For Pennies",
    images: ["https://musicforpennies.se/api"],
  },
};

export default async function page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Login - Music For Pennies",
    "description": "Sign in to access your Music For Pennies account.",
    "url": "https://musicforpennies.se/login",
    "about": {
      "@type": "Organization",
      "name": "Music For Pennies",
      "url": "https://musicforpennies.se",
      "logo": "https://musicforpennies.se/assets/logo.png"
    },
    "potentialAction": {
      "@type": "LoginAction",
      "target": "https://musicforpennies.se/login",
      "name": "Login to Music For Pennies"
    }
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LoginForm />
    </div>
  )
}
