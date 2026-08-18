import { Skeleton } from "@/shared/ui";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-border-subtle">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-none" />
          <Skeleton className="h-4 w-72 rounded-none" />
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-7 w-24 rounded-none" />
          <Skeleton className="h-8 w-32 rounded-none" />
          <Skeleton className="h-8 w-28 rounded-none" />
        </div>
      </div>

      {/* 4 Metric Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface border border-border-subtle p-4 rounded-none space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24 rounded-none" />
              <Skeleton className="h-4 w-4 rounded-none" />
            </div>
            <Skeleton className="h-8 w-16 rounded-none" />
            <Skeleton className="h-3 w-28 rounded-none" />
          </div>
        ))}
      </div>

      {/* Progress Bar Skeleton */}
      <div className="bg-surface border border-border-subtle p-5 rounded-none space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-40 rounded-none" />
            <Skeleton className="h-3 w-56 rounded-none" />
          </div>
          <Skeleton className="h-3.5 w-24 rounded-none" />
        </div>
        <Skeleton className="h-2.5 w-full rounded-none" />
        <div className="flex items-center gap-6 pt-1">
          <Skeleton className="h-3.5 w-20 rounded-none" />
          <Skeleton className="h-3.5 w-24 rounded-none" />
          <Skeleton className="h-3.5 w-20 rounded-none" />
        </div>
      </div>

      {/* 2 Column Lists Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, col) => (
          <div key={col} className="bg-surface border border-border-subtle rounded-none p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
              <Skeleton className="h-4 w-32 rounded-none" />
              <Skeleton className="h-3 w-20 rounded-none" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, row) => (
                <div key={row} className="p-2.5 rounded-none border border-border-subtle bg-subtle/40 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-1">
                    <Skeleton className="h-6 w-6 rounded-none shrink-0" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-3.5 w-3/4 rounded-none" />
                      <Skeleton className="h-2.5 w-1/2 rounded-none" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-14 rounded-none" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
