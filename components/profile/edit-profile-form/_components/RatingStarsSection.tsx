'use client';

import { Star } from 'lucide-react';

type RatingStarsSectionProps = {
  ratingStars: number | null;
  ratingLink: string | null;
  setRatingStars: (stars: number | null) => void;
  setRatingLink?: (link: string | null) => void;
};

export function RatingStarsSection({ ratingStars, ratingLink, setRatingStars, setRatingLink }: RatingStarsSectionProps) {
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

        <div>
          <div className="flex flex-row flex-1 gap-2 items-center" >
            <div className="flex flex-col flex-1 gap-2">
              <h2 className="text-primary font-bold flex items-center gap-2">
                <Star className="w-5 h-5" />
                Google Rating Link
              </h2>
              <label className="flex flex-row gap-2">
                <input
                  type="text"
                  name='rating-link'
                  value={ratingLink || ''}
                  placeholder='https://www.google.com/search?...'
                  onChange={(e) => setRatingLink && setRatingLink(e.target.value)}
                  className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />
              </label>
              <button
                type="button"
                onClick={() => {

                }}
                className="btn btn-outline flex place-self-end mt-4 w-fit align-bottom text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
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
