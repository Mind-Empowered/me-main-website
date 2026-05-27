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
      <div className="flex flex-col lg:flex-row gap-6 px-4 py-6 max-w-7xl mx-auto w-full">
        <div className="w-full lg:flex-1 space-y-6">
          <SkeletonCard className="h-56 rounded-3xl" />
          <SkeletonCard className="h-28 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonCard className="h-80 rounded-2xl" />
            <SkeletonCard className="h-80 rounded-2xl" />
          </div>
        </div>

        <aside className="w-full lg:w-1/3 flex-shrink-0">
          <SkeletonCard className="h-[31rem] rounded-2xl" />
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
