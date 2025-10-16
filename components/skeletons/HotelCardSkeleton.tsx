import { Skeleton } from "@/components/ui/skeleton";

export default function HotelCardSkeleton() {
  return (
    <div className="block">
      <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-200">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
      <div className="mt-3 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
