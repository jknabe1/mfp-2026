'use client';

import React from 'react';

interface CursorGradientHeroProps {
  children: React.ReactNode;
  className?: string;
}

// Static hero wrapper — no cursor spotlight effect.
// Renders a consistent bottom-to-top gradient scrim over the image
// to ensure text legibility without any motion side effects.
export default function CursorGradientHero({ children, className = '' }: CursorGradientHeroProps) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {children}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)',
        }}
        aria-hidden="true"
      />
    </div>
  );
}
