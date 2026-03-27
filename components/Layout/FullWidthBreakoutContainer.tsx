'use client';

/**
 * FullWidthBreakoutContainer
 * 
 * Demonstrates a layout pattern where:
 * - Outer container is constrained to max-width for readability
 * - Inner rectangle element spans full viewport width (100vw)
 * - Rectangle maintains aspect ratio and responsive scaling
 * - Text content remains within constrained width
 * 
 * This is useful for creating immersive visual elements within
 * otherwise constrained page layouts.
 */

interface FullWidthBreakoutContainerProps {
  children?: React.ReactNode;
  rectangleContent?: React.ReactNode;
  maxWidth?: string;
  rectangleHeight?: string;
  rectangleColor?: string;
}

export default function FullWidthBreakoutContainer({
  children,
  rectangleContent,
  maxWidth = 'max-w-4xl',
  rectangleHeight = 'h-96',
  rectangleColor = 'bg-gradient-to-r from-[var(--vividGreen)] to-black',
}: FullWidthBreakoutContainerProps) {
  return (
    <div className={`mx-auto ${maxWidth} px-4 lg:px-8`}>
      {/* Constrained content above rectangle */}
      {children && (
        <div className="mb-8 lg:mb-12">
          {children}
        </div>
      )}

      {/* Full-width breakout element */}
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className={`w-screen ${rectangleHeight} ${rectangleColor} flex items-center justify-center overflow-hidden`}>
          {/* Inner content centered within rectangle */}
          <div className="flex items-center justify-center w-full h-full px-4">
            {rectangleContent ? (
              rectangleContent
            ) : (
              <div className="text-center text-white">
                <h2 className="text-sans-35 lg:text-sans-60 font-600 uppercase text-balance">
                  Full-Width Rectangle
                </h2>
                <p className="text-sans-14 lg:text-sans-16 mt-4 opacity-80">
                  This element spans the full viewport width while the container remains constrained
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Constrained content below rectangle */}
      <div className="mt-8 lg:mt-12">
        <p className="text-sans-14 lg:text-sans-16 text-gray-600">
          Content below the rectangle stays within the constrained width, creating a balanced visual hierarchy.
        </p>
      </div>
    </div>
  );
}
