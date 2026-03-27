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
 * CursorFollowImage - Wraps children and displays an image that follows the cursor on hover.
 * Uses GPU-accelerated transforms for smooth performance.
 * Respects reduced-motion preferences for accessibility.
 */
export default function CursorFollowImage({
  imageUrl,
  alt,
  children,
  className = '',
}: CursorFollowImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number | null>(null);
  const prefersReducedMotion = useRef(false);

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (prefersReducedMotion.current) return;

    // Cancel any pending animation frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    // Use requestAnimationFrame for smooth updates
    rafRef.current = requestAnimationFrame(() => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        // Position image offset from cursor (bottom-right of cursor)
        const x = e.clientX - rect.left + 16;
        const y = e.clientY - rect.top + 16;
        setPosition({ x, y });
      }
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (prefersReducedMotion.current || !imageUrl) return;
    setIsHovering(true);
    // Small delay for fade-in effect
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, [imageUrl]);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
    // Wait for fade-out animation to complete before removing
    setTimeout(() => {
      setIsHovering(false);
    }, 200);

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Don't render hover image on touch devices or if no image
  if (!imageUrl) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {children}

      {/* Cursor-following image */}
      {isHovering && (
        <div
          className="pointer-events-none fixed z-50 hidden lg:block"
          style={{
            left: containerRef.current?.getBoundingClientRect().left ?? 0,
            top: containerRef.current?.getBoundingClientRect().top ?? 0,
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 200ms ease-out',
            willChange: 'transform, opacity',
          }}
        >
          <div className="relative w-[200px] h-[250px] lg:w-[240px] lg:h-[300px] overflow-hidden border border-black shadow-xl">
            <Image
              src={imageUrl}
              alt={alt}
              fill
              className="object-cover"
              sizes="240px"
              loading="eager"
            />
            {/* Subtle noise overlay for consistency */}
            <div className="absolute inset-0 noise opacity-30 pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  );
}
