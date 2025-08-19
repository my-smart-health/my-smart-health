
import TopCarouselSkeleton from "./TopCarouselSkeleton";

type CarouselItemProps = {
  props?: {
    id: string;
    imageSrc: string;
    name: string;
  }[]
};

export default function TopCarousel({ props }: CarouselItemProps) {

  if (!props || props.length === 0) {
    return (
      <TopCarouselSkeleton times={7} />
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="carousel carousel-center bg-white rounded-box max-w-sm space-x-4 p-4 overflow-hidden animate-infinite-scroll">
        {
          props.map((item) => (
            <div className="carousel-item w-20 flex flex-col items-center" key={item.id}>
              <img
                src={item.imageSrc}
                className="rounded-box" />
              <p>{item.name}</p>
            </div>
          ))
        }
      </div>
    </div>

  );
}
