type TopCarouselSkeletonProps = {
  times?: number;
};

export default function TopCarouselSkeleton({ times = 7 }: TopCarouselSkeletonProps) {
  return (
    <div className="carousel carousel-center bg-white rounded-box max-w-sm space-x-4 p-4">
      {Array.from({ length: times }).map((_, index) => (
        <div key={index} className="carousel-item w-20 flex flex-col items-center">
          <div className="flex w-20 flex-col gap-4">
            <div className="skeleton h-20 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}