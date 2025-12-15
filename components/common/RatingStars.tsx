import Link from "next/link";

type RatingStarsProps = {
  id: string;
  stars: number | null;
  ratingLink?: string | null;
};

export default function RatingStars({ id, stars, ratingLink }: RatingStarsProps) {
  const starElements = [];

  for (let i = 1; i <= 10; i++) {
    const isHalf = i % 2 === 1;
    const isChecked = i === stars;
    starElements.push(
      <input
        key={`star-${i}`}
        type="radio"
        name={`rating-${id}`}
        className={`mask mask-star-2 ${isHalf ? 'mask-half-1' : 'mask-half-2'} bg-primary`}
        aria-label={`${i / 2} stars`}
        defaultChecked={isChecked}
        disabled
      />
    );
  }
  if (!ratingLink) {
    return (
      <div className="flex w-full items-center text-sm mt-2">
        <div className="rating rating-sm rating-half my-auto pointer-events-none">
          <input type="radio" name={`rating-${id}`} className="rating-hidden" defaultChecked={stars === 0} disabled />
          {starElements}
        </div>
      </div>
    );
  } else {
    return (
      <Link
        key={id + "rating"}
        href={ratingLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-fit h-fit p-2 border-b border-primary justify-center items-center text-sm hover:bg-primary/15 transition-colors">
        <div className="rating rating-sm rating-half my-auto pointer-events-none">
          <input type="radio" name={`rating-${id}`} className="rating-hidden" defaultChecked={stars === 0} disabled />
          {starElements}
        </div>
      </Link>
    );
  }
}