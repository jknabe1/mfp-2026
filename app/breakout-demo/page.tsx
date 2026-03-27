'use client';

import FullWidthBreakoutContainer from '@/components/Layout/FullWidthBreakoutContainer';

export default function BreakoutLayoutDemo() {
  return (
    <main className="min-h-screen bg-white py-12 lg:py-20">
      {/* Example 1: Basic Usage */}
      <section className="mb-20">
        <FullWidthBreakoutContainer
          maxWidth="max-w-3xl"
          rectangleHeight="h-80 md:h-96 lg:h-[500px]"
          rectangleColor="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <div>
            <h1 className="text-sans-60 font-600 uppercase mb-4">Example 1</h1>
            <p className="text-sans-16 text-gray-600 leading-relaxed">
              This constrained container has a maximum width, but the rectangle inside breaks out to span the full viewport width. The content above and below remains within the constrained width for optimal readability.
            </p>
          </div>
        </FullWidthBreakoutContainer>
      </section>

      {/* Example 2: With Custom Content */}
      <section className="mb-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <h2 className="text-sans-35 font-600 uppercase mb-8">Example 2: Custom Content</h2>
          <p className="text-sans-16 text-gray-600 mb-12 leading-relaxed">
            The rectangle can contain custom content, making it flexible for different use cases like featured sections, CTAs, or visual highlights.
          </p>
        </div>

        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <div className="w-screen h-80 md:h-96 lg:h-[500px] bg-gradient-to-b from-[var(--vividGreen)] via-black to-black flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h3 className="text-sans-35 lg:text-sans-60 font-600 uppercase mb-4 text-balance">
                Featured Highlight
              </h3>
              <p className="text-sans-14 lg:text-sans-16 max-w-2xl mx-auto opacity-90">
                This is a custom full-width breakout element with distinct styling that grabs user attention while maintaining responsive design.
              </p>
              <button className="mt-8 px-8 py-3 bg-white text-black font-600 uppercase text-sans-12 hover:bg-gray-100 transition-colors">
                Call to Action
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 lg:px-8 mt-12">
          <p className="text-sans-16 text-gray-600 leading-relaxed">
            The layout maintains proper spacing and visual hierarchy. The rectangle is perfectly proportioned and responsive across all screen sizes.
          </p>
        </div>
      </section>

      {/* Example 3: Demonstrating Responsive Behavior */}
      <section>
        <div className="mx-auto max-w-4xl px-4 lg:px-8 mb-12">
          <h2 className="text-sans-35 font-600 uppercase mb-4">Responsive Design Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sans-14">
            <div>
              <p className="font-600 mb-2">Mobile (1 col)</p>
              <p className="text-gray-600">Rectangle spans full viewport on small screens, maintaining 100% width.</p>
            </div>
            <div>
              <p className="font-600 mb-2">Tablet & Desktop (2 col)</p>
              <p className="text-gray-600">Rectangle continues to span full viewport while container remains constrained.</p>
            </div>
            <div>
              <p className="font-600 mb-2">Viewport Width Units</p>
              <p className="text-gray-600">Uses `w-screen` and negative margins (`-ml-[50vw]`) to break out of parent container.</p>
            </div>
            <div>
              <p className="font-600 mb-2">Aspect Ratio</p>
              <p className="text-gray-600">Rectangle maintains proper proportions via responsive height classes.</p>
            </div>
          </div>
        </div>

        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-12">
          <div className="w-screen h-72 md:h-80 lg:h-96 bg-black border-y-2 border-[var(--vividGreen)] flex items-center justify-center">
            <div className="text-center text-white px-4">
              <p className="text-sans-12 uppercase tracking-widest opacity-60 mb-2">Responsive Rectangle</p>
              <p className="text-sans-16 lg:text-sans-20 font-600">
                Resize your browser to see how the rectangle adapts
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <p className="text-sans-14 text-gray-600 leading-relaxed">
            This layout pattern is perfect for creating immersive visual experiences while maintaining content readability. Use it for hero sections, featured content, CTAs, or any element that should command full-width attention within a constrained layout.
          </p>
        </div>
      </section>
    </main>
  );
}
