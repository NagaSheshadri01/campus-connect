export function CardSkeleton() {
  return (
    <div className="glass-panel p-5 space-y-3">
      <div className="flex justify-between">
        <div className="h-4 w-32 rounded-lg animate-shimmer" />
        <div className="h-6 w-20 rounded-full animate-shimmer" />
      </div>
      <div className="h-4 w-full rounded-lg animate-shimmer" />
      <div className="h-4 w-3/4 rounded-lg animate-shimmer" />
      <div className="flex gap-4 mt-2">
        <div className="h-3 w-16 rounded-lg animate-shimmer" />
        <div className="h-3 w-20 rounded-lg animate-shimmer" />
        <div className="h-3 w-24 rounded-lg animate-shimmer" />
      </div>
    </div>
  );
}

export function WidgetSkeleton() {
  return (
    <div className="glass-panel p-5 space-y-3">
      <div className="flex justify-between">
        <div className="h-3 w-24 rounded-lg animate-shimmer" />
        <div className="h-10 w-10 rounded-xl animate-shimmer" />
      </div>
      <div className="h-10 w-16 rounded-lg animate-shimmer" />
    </div>
  );
}