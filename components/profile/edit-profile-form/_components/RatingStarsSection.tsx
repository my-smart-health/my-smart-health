'use client';

import { Star } from 'lucide-react';

type RatingStarsSectionProps = {
  ratingStars: number | null;
  setRatingStars: (stars: number | null) => void;
};

export function RatingStarsSection({ ratingStars, setRatingStars }: RatingStarsSectionProps) {
  const currentRating = ratingStars ?? 0;

  const handleRatingChange = (value: number) => {
    if (value === ratingStars) {
      setRatingStars(null);
    } else {
      setRatingStars(value);
    }
  };

  const getStarLabel = (value: number): string => {
    const starValue = value / 2;
    return `${starValue} ${starValue === 1 ? 'star' : 'stars'}`;
  };

  return (
    <>
      <h2 className="text-primary font-bold flex items-center gap-2">
        <Star className="w-5 h-5" />
        Rating Stars
      </h2>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text font-semibold">Bewertung auswählen (0 - 5 Sterne)</span>
        </label>

        <div className="rating rating-lg rating-half">
          <input
            type="radio"
            name="rating-stars"
            className="rating-hidden"
            checked={currentRating === 0}
            onChange={() => setRatingStars(null)}
            aria-label="No rating"
          />
          {Array.from({ length: 10 }, (_, i) => {
            const value = i + 1;
            const isHalf = value % 2 === 1;
            return (
              <input
                key={value}
                type="radio"
                name="rating-stars"
                className={`mask mask-star-2 ${isHalf ? 'mask-half-1' : 'mask-half-2'} bg-primary`}
                checked={currentRating === value}
                onChange={() => handleRatingChange(value)}
                aria-label={getStarLabel(value)}
              />
            );
          })}
        </div>
      </div>

      <div className={`p-4 border rounded-lg w-full text-center ${ratingStars !== null ? 'border-primary bg-primary/10' : 'border-gray-300 bg-gray-50'}`}>
        {ratingStars !== null ? (
          <div className="flex items-center justify-center gap-2">
            <Star className="w-5 h-5 text-primary fill-primary" />
            <p className="text-primary font-semibold">
              Bewertung: {(ratingStars / 2).toFixed(1)} von 5 Sternen
            </p>
          </div>
        ) : (
          <p className="text-gray-700 font-semibold">Keine Bewertung gesetzt</p>
        )}
      </div>
    </>
  );
}
