import React from "react";

const SkeletonLine = ({ className = "" }) => (
  <div className={`animate-pulse rounded-full bg-gradient-to-r from-[#e7ddd4] via-white to-[#e7ddd4] bg-[length:200%_100%] ${className}`} />
);

const SkeletonCard = ({ className = "" }) => (
  <div className={`animate-pulse rounded-2xl bg-gradient-to-r from-[#e7ddd4] via-white to-[#e7ddd4] bg-[length:200%_100%] ${className}`} />
);

export const VolunteerProfileSkeleton = () => (
  <div className="min-h-screen bg-[#F5EDE0] flex flex-col overflow-hidden">
    <header className="flex items-center justify-between p-4 bg-[#FAF7F2] border-b border-[#461711]/5">
      <div className="flex items-center gap-4">
        <SkeletonCard className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <SkeletonLine className="h-4 w-36" />
          <SkeletonLine className="h-3 w-24" />
        </div>
      </div>
      <SkeletonCard className="h-10 w-10 rounded-xl" />
    </header>

    <main className="flex-1 overflow-y-auto">
      <div className="flex flex-col xl:flex-row gap-4 px-4 sm:px-6 lg:px-8 py-4 w-full">
        {/* Left Column */}
        <div className="w-full xl:flex-1 space-y-4">
          <SkeletonCard className="h-[14rem] rounded-3xl" />
          
          {/* Middle Row Grid (3 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SkeletonCard className="h-64 rounded-2xl" />
            <SkeletonCard className="h-64 rounded-2xl" />
            <SkeletonCard className="h-64 rounded-2xl" />
          </div>
          
          {/* Bottom Row */}
          <div className="w-full">
            <SkeletonCard className="h-48 rounded-2xl" />
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="w-full xl:w-1/3 flex-shrink-0">
          <SkeletonCard className="h-[40rem] rounded-2xl" />
        </aside>
      </div>
    </main>
  </div>
);

export const SectionSkeleton = ({ titleWidth = "w-40", itemCount = 3, cardHeight = "h-24" }) => (
  <div className="bg-white rounded-2xl p-6 flex flex-col h-full">
    <SkeletonLine className={`h-6 ${titleWidth} mb-4`} />
    <div className="space-y-3 flex-1">
      {Array.from({ length: itemCount }).map((_, index) => (
        <SkeletonCard key={index} className={`${cardHeight} rounded-lg`} />
      ))}
    </div>
  </div>
);

export const ProfileSummarySkeleton = () => (
  <SkeletonCard className="h-[19rem] rounded-3xl" />
);
