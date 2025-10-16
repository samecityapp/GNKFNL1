import { Skeleton } from "@/components/ui/skeleton";

export default function HotelDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-10 w-24" />
        </div>

        <div className="mb-4">
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-20 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <Skeleton className="w-full aspect-video rounded-2xl" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="aspect-video rounded-2xl" />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              <Skeleton className="h-14 w-32" />
              <Skeleton className="h-14 w-32" />
              <Skeleton className="h-14 w-32" />
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
