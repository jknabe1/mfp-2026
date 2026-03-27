'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/client';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

interface ImageCarouselProps {
  images: SanityImageSource[];
  title?: string;
}

export default function ImageCarousel({ images, title = 'Galleribilder' }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoplay || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, [isAutoplay, images.length]);

  if (!images || images.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setIsAutoplay(false);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setIsAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoplay(false);
    setCurrentIndex(index);
  };

  return (
    <div className="w-full border border-black border-solid">
      {/* Gallery header */}
      <div className="px-4 py-4 lg:px-8 lg:py-6 border-b border-black border-solid">
        <p className="text-sans-12 font-600 uppercase tracking-widest opacity-50">{title}</p>
        <p className="text-sans-12 font-400 tracking-wide mt-2 opacity-75">
          {currentIndex + 1} av {images.length}
        </p>
      </div>

      {/* Main carousel image */}
      <div className="relative w-full h-[50vw] min-h-[250px] max-h-[600px] bg-gray-100 overflow-hidden">
        <Image
          src={urlFor(images[currentIndex]).width(1200).quality(85).url()}
          alt={`Galleri bild ${currentIndex + 1} av ${images.length}`}
          fill
          className="object-cover noise transition-opacity duration-500"
          sizes="100vw"
          loading="lazy"
        />

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            {/* Previous button */}
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 z-20 bg-black/60 hover:bg-black text-white p-3 transition-all"
              aria-label="Föregående bild"
              onMouseEnter={() => setIsAutoplay(false)}
              onMouseLeave={() => setIsAutoplay(true)}
            >
              <span className="block text-sans-18 font-600">←</span>
            </button>

            {/* Next button */}
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 z-20 bg-black/60 hover:bg-black text-white p-3 transition-all"
              aria-label="Nästa bild"
              onMouseEnter={() => setIsAutoplay(false)}
              onMouseLeave={() => setIsAutoplay(true)}
            >
              <span className="block text-sans-18 font-600">→</span>
            </button>

            {/* Dots indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Gå till bild ${index + 1}`}
                  aria-current={index === currentIndex}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-px overflow-x-auto border-t border-black border-solid bg-gray-50">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 relative border-r border-black border-solid transition-opacity ${
                index === currentIndex
                  ? 'ring-2 ring-inset ring-[var(--vividGreen)]'
                  : 'opacity-60 hover:opacity-100'
              }`}
              aria-label={`Välj bild ${index + 1}`}
              aria-current={index === currentIndex}
            >
              <Image
                src={urlFor(image).width(200).quality(75).url()}
                alt={`Miniatyr ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
