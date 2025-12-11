type RatingStarsProps = {
  id: string;
  stars: number | null;
};

export default function RatingStars({ id, stars }: RatingStarsProps) {
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

  return (
    <div key={id + "rating"} className="rating rating-sm rating-half my-auto mr-auto pointer-events-none">
      <input type="radio" name={`rating-${id}`} className="rating-hidden" defaultChecked={stars === 0} disabled />
      {starElements}
    </div>
  );
}