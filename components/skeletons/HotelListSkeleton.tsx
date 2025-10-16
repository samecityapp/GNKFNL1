import { Skeleton } from "@/components/ui/skeleton";

export default function HotelListSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-72 h-56 md:h-auto flex-shrink-0">
          <Skeleton className="w-full h-full rounded-none" />
        </div>
        <div className="flex-1 p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="ml-4 space-y-1">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
