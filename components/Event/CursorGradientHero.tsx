'use client';

import React, { useState, useRef, useEffect } from 'react';

interface CursorGradientHeroProps {
  children: React.ReactNode;
  className?: string;
}

export default function CursorGradientHero({ children, className = '' }: CursorGradientHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseOver, setIsMouseOver] = useState(false);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseOver) return;

      // Cancel previous animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Use requestAnimationFrame for throttled updates
      animationFrameRef.current = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setMousePosition({ x, y });

        if (gradientRef.current) {
          // Apply radial gradient centered on cursor
          gradientRef.current.style.background = `
            radial-gradient(
              circle 400px at ${x}px ${y}px,
              rgba(0, 0, 0, 0.3) 0%,
              rgba(0, 0, 0, 0.5) 100%
            )
          `;
        }
      });
    };

    const handleMouseEnter = () => {
      setIsMouseOver(true);
    };

    const handleMouseLeave = () => {
      setIsMouseOver(false);
      // Reset to default gradient on mouse leave
      if (gradientRef.current) {
        gradientRef.current.style.background = 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 100%)';
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMouseOver]);

  // Detect reduced motion preference for accessibility
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
    >
      {children}
      
      {/* Overlay gradient - smoothly follows cursor or defaults to bottom gradient */}
      {!prefersReducedMotion && (
        <div
          ref={gradientRef}
          className="absolute inset-0 pointer-events-none transition-all duration-300 ease-out"
          style={{
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 100%)',
          }}
          aria-hidden="true"
        />
      )}
      
      {/* Static gradient for reduced motion or as fallback */}
      {prefersReducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 100%)',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
