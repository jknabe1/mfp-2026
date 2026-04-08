'use client';

export function ArrangemangRowSkeleton() {
  return (
    <div className="group border-b border-black border-solid flex flex-col sm:flex-row items-stretch animate-pulse">
      {/* Left: image placeholder */}
      <div className="shrink-0 bg-gray-200 sm:w-[260px] lg:w-[360px] min-h-[180px] sm:min-h-[220px] lg:min-h-[270px]" />

      {/* Right: content placeholder */}
      <div className="flex flex-col px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 border-t border-black sm:border-t-0 sm:border-l border-solid flex-1 gap-4">
        {/* Index badge */}
        <div className="w-12 h-8 bg-gray-300 rounded" />

        {/* Title and button row */}
        <div className="flex items-start gap-4">
          {/* Title lines */}
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-gray-300 rounded w-3/4" />
            <div className="h-6 bg-gray-300 rounded w-2/3" />
          </div>

          {/* Button skeleton */}
          <div className="w-20 h-10 bg-gray-300 rounded shrink-0" />
        </div>
      </div>
    </div>
  );
}

export function ArrangemangListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ArrangemangRowSkeleton key={i} />
      ))}
    </>
  );
}
