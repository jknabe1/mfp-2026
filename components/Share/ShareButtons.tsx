'use client'

import Link from 'next/link'

interface ShareButtonsProps {
  title: string
  url: string
  variant?: 'light' | 'dark'
}

export default function ShareButtons({ title, url, variant = 'dark' }: ShareButtonsProps) {
  const isDark = variant === 'dark'
  
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
  const emailShareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Kolla in detta: ${url}`)}`

  return (
    <div className={`border border-solid p-6 md:p-8 ${isDark ? 'border-black' : 'border-gray-200'}`}>
      <h2 className={`text-sans-18 font-600 mb-4 uppercase tracking-wide ${isDark ? 'text-black' : 'text-gray-900'}`}>
        {variant === 'dark' ? 'Dela' : 'Share'}
      </h2>
      <div className="flex gap-3">
        <Link
          href={facebookShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center w-10 h-10 transition-colors ${
            isDark 
              ? 'bg-black text-white hover:bg-neutral-800' 
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
          aria-label={variant === 'dark' ? 'Dela på Facebook' : 'Share on Facebook'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </Link>
        <Link
          href={twitterShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center w-10 h-10 transition-colors ${
            isDark 
              ? 'bg-black text-white hover:bg-neutral-800' 
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
          aria-label={variant === 'dark' ? 'Dela på X (Twitter)' : 'Share on X (Twitter)'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </Link>
        <Link
          href={emailShareUrl}
          className={`flex items-center justify-center w-10 h-10 transition-colors ${
            isDark 
              ? 'bg-black text-white hover:bg-neutral-800' 
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
          aria-label={variant === 'dark' ? 'Dela via e-post' : 'Share via email'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </Link>
      </div>
    </div>
  )
}
