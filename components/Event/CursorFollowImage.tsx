"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';

interface CursorFollowImageProps {
  imageUrl: string;
  alt: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * CursorFollowImage — on desktop hover, expands a full-viewport-width image
 * panel that fades in beneath the row and fades out on mouse leave.
 * Respects prefers-reduced-motion for accessibility.
 */
export default function CursorFollowImage({
  imageUrl,
  alt,
  children,
  className = '',
}: CursorFollowImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = useRef(false);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (prefersReducedMotion.current || !imageUrl) return;
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setIsMounted(true);
    // Defer visibility by one frame so the mount transition fires
    requestAnimationFrame(() => setIsVisible(true));
  }, [imageUrl]);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
    hideTimeout.current = setTimeout(() => setIsMounted(false), 300);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  if (!imageUrl) return <div className={className}>{children}</div>;

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {/* Full-width image panel — desktop only, expands beneath the row */}
      {isMounted && (
        <div
          className="pointer-events-none hidden lg:block absolute left-0 right-0 top-full z-40 overflow-hidden border-b border-black"
          style={{
            // Expand from 0 → auto height via max-height transition
            maxHeight: isVisible ? '60vw' : '0px',
            transition: isVisible
              ? 'max-height 380ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease-out'
              : 'max-height 300ms cubic-bezier(0.4,0,0.2,1), opacity 250ms ease-out',
            opacity: isVisible ? 1 : 0,
            willChange: 'max-height, opacity',
          }}
          aria-hidden="true"
        >
          <div className="relative w-full" style={{ paddingBottom: '42%' }}>
            <Image
              src={imageUrl}
              alt={alt}
              fill
              className="object-cover object-center noise"
              sizes="10vw"
              loading="eager"
            />
            {/* Bottom fade so the panel blends into the next row */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35) 100%)',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
