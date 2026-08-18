import { Skeleton } from "@/shared/ui";

export default function NotesLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-border-subtle">
        <div className="space-y-2">
          <Skeleton className="h-7 w-36 rounded-none" />
          <Skeleton className="h-4 w-64 rounded-none" />
        </div>
        <Skeleton className="h-8 w-36 rounded-none" />
      </div>

      {/* Search & Filter Bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 w-full max-w-md">
          <Skeleton className="h-8 flex-1 rounded-none" />
          <Skeleton className="h-8 w-40 rounded-none" />
        </div>
        <Skeleton className="h-4 w-24 rounded-none" />
      </div>

      {/* 3 Column Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-none border border-border-subtle bg-surface p-3.5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16 rounded-none" />
                <Skeleton className="h-4 w-24 rounded-none" />
              </div>
              <Skeleton className="h-4 w-8 rounded-none" />
            </div>
            <div className="space-y-1.5 py-1">
              <Skeleton className="h-3 w-full rounded-none" />
              <Skeleton className="h-3 w-5/6 rounded-none" />
              <Skeleton className="h-3 w-4/6 rounded-none" />
            </div>
            <div className="pt-2 border-t border-border-subtle">
              <Skeleton className="h-2.5 w-20 rounded-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
