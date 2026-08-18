import { Skeleton } from "@/shared/ui";

export default function TasksLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-border-subtle">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40 rounded-none" />
          <Skeleton className="h-4 w-60 rounded-none" />
        </div>
        <Skeleton className="h-8 w-36 rounded-none" />
      </div>

      {/* 3 Kanban Columns Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {Array.from({ length: 3 }).map((_, col) => (
          <div
            key={col}
            className="flex flex-col gap-3 rounded-none border border-border-subtle bg-surface p-3.5 min-h-[440px] shadow-2xs"
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-2 rounded-none" />
                <Skeleton className="h-4 w-24 rounded-none" />
                <Skeleton className="h-3.5 w-6 rounded-none" />
              </div>
              <Skeleton className="h-4 w-4 rounded-none" />
            </div>

            <div className="flex-1 space-y-2">
              {Array.from({ length: 3 }).map((_, item) => (
                <div key={item} className="rounded-none border border-border-subtle bg-surface p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-16 rounded-none" />
                    <Skeleton className="h-4 w-10 rounded-none" />
                  </div>
                  <Skeleton className="h-3.5 w-3/4 rounded-none" />
                  <Skeleton className="h-2.5 w-full rounded-none" />
                  <Skeleton className="h-2 w-16 pt-1 rounded-none" />
                </div>
              ))}
            </div>

            <Skeleton className="h-7 w-full rounded-none mt-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
