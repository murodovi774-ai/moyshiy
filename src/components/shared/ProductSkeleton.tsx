export default function ProductSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array(count)
        .fill(null)
        .map((_, i) => (
          <div
            key={i}
            className="rounded-[24px] border border-border/50 bg-white/60 p-4 space-y-4 animate-pulse overflow-hidden"
          >
            <div className="w-full aspect-square bg-muted/60 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-4 bg-muted/60 rounded w-3/4" />
              <div className="h-3 bg-muted/40 rounded w-1/2" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="h-5 bg-muted/60 rounded w-20" />
              <div className="w-10 h-10 bg-muted/60 rounded-full" />
            </div>
          </div>
        ))}
    </div>
  );
}
