"use client";

interface OrderListSkeletonProps {
  showAllOrders?: boolean;
  isOverviewPage?: boolean;
  groupCount?: number;
  rowsPerGroup?: number;
}

function OrderRowSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-3 mb-2 flex items-center justify-between">
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3.5 w-2/3 bg-slate-200" />
        <div className="skeleton h-3 w-1/3 bg-slate-200" />
      </div>
      <div className="flex items-center space-x-2">
        <div className="skeleton h-3 w-10 bg-slate-200" />
        <div className="skeleton w-8 h-8 rounded-full bg-slate-200" />
      </div>
    </div>
  );
}

export default function OrderListSkeleton({
  showAllOrders = false,
  isOverviewPage = false,
  groupCount,
  rowsPerGroup = 2,
}: OrderListSkeletonProps) {
  const groups = groupCount ?? (showAllOrders ? 2 : 1);

  return (
    <div aria-busy="true" aria-live="polite">
      <div className="flex items-center justify-between mb-3">
        <div className="skeleton h-5 w-28 bg-slate-300/60" />
      </div>

      {Array.from({ length: groups }).map((_, groupIdx) => (
        <div key={groupIdx} className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="skeleton h-3.5 w-24 bg-slate-300/60" />
            {isOverviewPage && (
              <div className="skeleton h-3 w-12 bg-slate-300/60" />
            )}
          </div>
          <div className="space-y-1">
            {Array.from({ length: rowsPerGroup }).map((_, rowIdx) => (
              <OrderRowSkeleton key={rowIdx} />
            ))}
          </div>
        </div>
      ))}

      {isOverviewPage && (
        <div className="mt-4 pt-4 border-t border-slate-300 space-y-2">
          <div className="flex justify-between items-center">
            <div className="skeleton h-4 w-20 bg-slate-300/60" />
            <div className="skeleton h-4 w-14 bg-slate-300/60" />
          </div>
          <div className="flex justify-between items-center">
            <div className="skeleton h-4 w-16 bg-slate-300/60" />
            <div className="skeleton h-4 w-12 bg-slate-300/60" />
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-200">
            <div className="skeleton h-5 w-20 bg-slate-300/60" />
            <div className="skeleton h-5 w-16 bg-slate-300/60" />
          </div>
        </div>
      )}
    </div>
  );
}
