/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from 'next-sanity';
import { useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/client';

// Define the type for Sanity image source
interface SanityImageSource {
  asset: {
    _ref: string;
  };
  caption?: string;
}

// Define the arrangemang data structure
interface Arrangemang {
  currentSlug: string;
  Namn: string;
  Beskrivning: any[]; // PortableTextBlock[]
  additionalInfo?: any[];
  Bild: SanityImageSource;
  gallery?: SanityImageSource[];
  date?: string;
  location?: string;
  Instagram?: string;
  Facebook?: string;
  spotify?: string;
  excerpt?: string;
}

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export default function ArrangemangClient({ arrangemang }: { arrangemang: Arrangemang }) {
  const [selectedImage, setSelectedImage] = useState(0);

  // Keen Slider for gallery
  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: "snap",
    slides: {
      perView: 1,
      spacing: 0,
    },
  });

  // Combine main image with gallery for carousel
  const allImages = [
    { ...arrangemang.Bild, caption: arrangemang.Namn },
    ...(arrangemang.gallery || [])
  ];

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      {/* Full Width Hero Image */}
      <div className="relative w-full h-[50vh] lg:h-[70vh] overflow-hidden">
        <Image
          src={urlFor(arrangemang.Bild).url()}
          alt={arrangemang.Namn}
          fill
          className="object-cover"
          priority
        />
        {/* Optional overlay for better text readability if needed */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4 py-12 lg:py-16">
        
        {/* Title and Event Details */}
        <div className="text-center mb-12">
          <h1 className="text-sans-45 lg:text-sans-70 font-600 mb-4">{arrangemang.Namn}</h1>
        </div>

        {/* Main Description */}
        <div className="prose prose-lg max-w-none mb-16">
          <PortableText value={arrangemang.Beskrivning} />
        </div>

        {/* Gallery Section */}
        {allImages.length > 1 && (
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold mb-8 text-center">Bilder från evenemanget</h2>
            
            {/* Thumbnails */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 justify-center">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0 border-2 transition-all rounded overflow-hidden ${
                    selectedImage === index ? 'border-black' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={urlFor(image).width(100).height(100).url()}
                    alt={image.caption || arrangemang.Namn}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Carousel */}
            <div ref={sliderRef} className="keen-slider">
              {allImages.map((image, index) => (
                <div key={index} className="keen-slider__slide">
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={urlFor(image).width(1200).height(675).url()}
                      alt={image.caption || arrangemang.Namn}
                      fill
                      className="object-contain"
                      priority={index === 0}
                    />
                  </div>
                  {image.caption && (
                    <p className="text-sm text-center mt-4 text-gray-600 max-w-2xl mx-auto">
                      {image.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Back to All Events Link */}
      <div className="border-t border-gray-200">
        <Link 
          href="/arrangemang" 
          className="block px-4 py-6 text-lg hover:underline text-center"
        >
          ← Tillbaka till alla evenemang
        </Link>
      </div>
    </div>
  );
}