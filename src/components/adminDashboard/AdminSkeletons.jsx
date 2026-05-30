import React from 'react';

export const SkeletonBlock = ({ className = '' }) => (
  <div className={`animate-pulse rounded-2xl bg-gradient-to-r from-[#e7ddd4] via-white to-[#e7ddd4] bg-[length:200%_100%] ${className}`} />
);

export const AdminStatsSkeleton = ({ cards = 4 }) => (
  <div className={`grid gap-4 ${cards === 2 ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}>
    {Array.from({ length: cards }).map((_, index) => (
      <div key={index} className="rounded-xl bg-white p-5 shadow-sm border border-white/60">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <SkeletonBlock className="h-3 w-28 rounded-full" />
            <SkeletonBlock className="h-10 w-20 rounded-xl" />
            <SkeletonBlock className="h-3 w-32 rounded-full" />
          </div>
          <SkeletonBlock className="h-10 w-10 rounded-2xl" />
        </div>
      </div>
    ))}
  </div>
);

export const AdminQuickActionsSkeleton = ({ cards = 4 }) => (
  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
    {Array.from({ length: cards }).map((_, index) => (
      <div key={index} className="rounded-xl bg-white p-5 shadow-sm border border-white/60">
        <div className="flex flex-col items-center gap-3">
          <SkeletonBlock className="h-12 w-12 rounded-2xl" />
          <SkeletonBlock className="h-3 w-20 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

export const AdminListSkeleton = ({ rows = 4 }) => (
  <div className="space-y-4">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="rounded-xl border border-gray-100 bg-white p-4">
        <div className="flex items-center gap-4">
          <SkeletonBlock className="h-20 w-20 rounded-xl" />
          <div className="flex-1 space-y-3">
            <SkeletonBlock className="h-4 w-2/5 rounded-full" />
            <SkeletonBlock className="h-3 w-3/5 rounded-full" />
            <SkeletonBlock className="h-3 w-1/2 rounded-full" />
          </div>
          <div className="hidden md:flex gap-2">
            <SkeletonBlock className="h-10 w-10 rounded-lg" />
            <SkeletonBlock className="h-10 w-10 rounded-lg" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const AdminTableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
    <div
      className="grid gap-4 border-b border-gray-100 bg-[#EFE7DD] p-4"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: columns }).map((_, index) => (
        <SkeletonBlock key={index} className="h-4 rounded-full" />
      ))}
    </div>
    <div className="divide-y divide-gray-100">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4 p-4"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonBlock key={colIndex} className="h-8 rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const AdminGallerySkeleton = ({ items = 12 }) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
    {Array.from({ length: items }).map((_, index) => (
      <SkeletonBlock key={index} className="aspect-square rounded-lg" />
    ))}
  </div>
);

export const AdminNewsletterSkeleton = () => (
  <div className="grid grid-cols-2 gap-5">
    <div className="space-y-5">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <SkeletonBlock className="h-4 w-36 rounded-full" />
        <SkeletonBlock className="mt-4 h-10 w-24 rounded-xl" />
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <SkeletonBlock className="h-4 w-40 rounded-full" />
        <SkeletonBlock className="mt-4 h-[225px] w-full rounded-2xl" />
        <div className="mt-5 grid grid-cols-2 gap-4">
          <SkeletonBlock className="h-11 rounded-lg" />
          <SkeletonBlock className="h-11 rounded-lg" />
        </div>
        <div className="mt-6 flex justify-between gap-3">
          <SkeletonBlock className="h-10 w-28 rounded-xl" />
          <SkeletonBlock className="h-10 w-32 rounded-xl" />
        </div>
      </div>
    </div>
    <div className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
      <SkeletonBlock className="h-5 w-40 rounded-full" />
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 rounded-xl border border-gray-100 p-4">
          <SkeletonBlock className="h-20 w-20 rounded-lg" />
          <div className="flex-1 space-y-3">
            <SkeletonBlock className="h-4 w-44 rounded-full" />
            <SkeletonBlock className="h-3 w-28 rounded-full" />
          </div>
          <SkeletonBlock className="h-10 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  </div>

);

export const AdminCalendarSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
    {/* Upload Section */}
    <div>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <SkeletonBlock className="h-6 w-40 rounded-full mb-5" />
        
        {/* Upload Area */}
        <SkeletonBlock className="h-[280px] w-full rounded-2xl mb-4" />
        
        {/* Month/Year Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <SkeletonBlock className="h-11 rounded-lg" />
          <SkeletonBlock className="h-11 rounded-lg" />
        </div>
        
        {/* File Info Section (appears after file upload) */}
        <div className="rounded-xl bg-[#FAF6F1] p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-4 w-48 rounded-full" />
              <SkeletonBlock className="h-3 w-20 rounded-full" />
            </div>
            <SkeletonBlock className="h-10 w-10 rounded-lg flex-shrink-0" />
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <SkeletonBlock className="h-10 w-24 rounded-lg" />
            <SkeletonBlock className="h-10 w-28 rounded-lg" />
          </div>
        </div>
      </div>
    </div>

    {/* Recent Calendars Section */}
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <SkeletonBlock className="h-6 w-40 rounded-full" />
        <SkeletonBlock className="h-4 w-20 rounded-full" />
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[60vh]">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-gray-100 bg-white p-4">
            <div className="flex items-center gap-4">
              {/* Calendar Thumbnail */}
              <SkeletonBlock className="h-20 w-20 rounded-lg flex-shrink-0" />
              
              {/* Calendar Info */}
              <div className="flex-1 min-w-0 space-y-3">
                <SkeletonBlock className="h-4 w-32 rounded-full" />
                <SkeletonBlock className="h-3 w-40 rounded-full" />
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 flex-shrink-0">
                <SkeletonBlock className="h-9 w-16 rounded-lg" />
                <SkeletonBlock className="h-9 w-16 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
