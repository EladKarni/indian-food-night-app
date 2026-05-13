export default function EventInfoSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between ${className || ""}`}>
      <div className="flex-1 space-y-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm mr-3 skeleton bg-slate-300/60" />
          <div className="skeleton h-3.5 w-40 bg-slate-300/60" />
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm mr-3 skeleton bg-slate-300/60" />
          <div className="skeleton h-3 w-48 bg-slate-300/60" />
        </div>
      </div>
      <div className="skeleton w-10 h-10 rounded-full ml-4 bg-slate-300/60" />
    </div>
  );
}
