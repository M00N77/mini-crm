import { Skeleton } from "@/shared/ui";

export default function ContactsLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-border-subtle">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40 rounded-none" />
          <Skeleton className="h-4 w-64 rounded-none" />
        </div>
        <Skeleton className="h-8 w-36 rounded-none" />
      </div>

      {/* Search & Filter bar skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 w-full max-w-md">
          <Skeleton className="h-8 flex-1 rounded-none" />
          <Skeleton className="h-8 w-44 rounded-none" />
        </div>
        <Skeleton className="h-4 w-28 rounded-none" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-none border border-border-subtle bg-surface overflow-hidden shadow-2xs">
        <div className="grid grid-cols-[1.5fr_1.5fr_1fr_auto] gap-4 px-4 py-3 border-b border-border-subtle bg-subtle">
          <Skeleton className="h-4 w-16 rounded-none" />
          <Skeleton className="h-4 w-16 rounded-none" />
          <Skeleton className="h-4 w-20 hidden sm:block rounded-none" />
          <Skeleton className="h-4 w-16 ml-auto rounded-none" />
        </div>
        <div className="divide-y divide-border-subtle">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[1.5fr_1.5fr_1fr_auto] gap-4 px-4 py-3 items-center">
              <div className="flex items-center gap-2.5 min-w-0">
                <Skeleton className="h-7 w-7 rounded-none shrink-0" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-3.5 w-32 rounded-none" />
                  <Skeleton className="h-2.5 w-24 rounded-none" />
                </div>
              </div>
              <Skeleton className="h-3.5 w-36 rounded-none" />
              <Skeleton className="h-3.5 w-28 hidden sm:block rounded-none" />
              <div className="flex items-center gap-1 ml-auto">
                <Skeleton className="h-6 w-6 rounded-none" />
                <Skeleton className="h-6 w-6 rounded-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
