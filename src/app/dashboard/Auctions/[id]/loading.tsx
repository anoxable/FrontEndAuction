const AuctionSkeleton = () => {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 w-full">
          {/* Image Skeleton */}
          <div className="bg-gray-200 animate-pulse rounded-xl relative h-52 md:h-screen" />
  
          <div className="flex flex-col gap-4">
            {/* Auction Info Skeleton */}
            <div className="bg-white rounded-xl p-2">
              <div className="flex justify-between">
                <div className="bg-gray-200 animate-pulse rounded-full h-6 w-20" />
                <div className="bg-gray-200 animate-pulse rounded-full h-6 w-32" />
              </div>
              <div className="bg-gray-200 animate-pulse h-10 w-3/4 rounded mt-4" />
              <div className="bg-gray-200 animate-pulse h-24 w-full rounded mt-4" />
              <div className="float-right mt-4">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-200 animate-pulse w-16 h-6 rounded" />
                  <div className="bg-gray-200 animate-pulse w-20 h-10 rounded-full" />
                  <div className="bg-gray-200 animate-pulse w-24 h-10 rounded-full" />
                </div>
              </div>
            </div>
  
            {/* Bidding History Skeleton */}
            <div className="bg-white flex-1 rounded-xl">
              <div className="bg-gray-200 animate-pulse h-8 w-48 m-4 rounded" />
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex justify-between items-center p-2 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-200 animate-pulse w-8 h-8 rounded-full" />
                    <div className="flex flex-col gap-1">
                      <div className="bg-gray-200 animate-pulse w-24 h-4 rounded" />
                      <div className="bg-gray-200 animate-pulse w-32 h-4 rounded md:hidden" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                      <div className="bg-gray-200 animate-pulse w-36 h-4 rounded" />
                    </div>
                    <div className="bg-gray-200 animate-pulse w-20 h-6 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default AuctionSkeleton;