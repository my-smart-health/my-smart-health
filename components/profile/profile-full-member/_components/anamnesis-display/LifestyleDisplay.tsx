import { Heart } from 'lucide-react';
import { Lifestyle } from '@/utils/types';

type LifestyleDisplayProps = {
  lifestyle: Lifestyle;
};

export function LifestyleDisplay({ lifestyle }: LifestyleDisplayProps) {
  const hasAnyData =
    lifestyle.isSmoking !== null ||
    lifestyle.alcohol ||
    lifestyle.exercise ||
    lifestyle.diet ||
    lifestyle.stressLevel;

  if (!hasAnyData) {
    return null;
  }

  const getSmokingText = () => {
    if (lifestyle.isSmoking === null) return null;
    if (lifestyle.isSmoking) {
      return lifestyle.cigarettesPerDay
        ? `Yes (${lifestyle.cigarettesPerDay} cigarettes/day)`
        : 'Yes';
    }
    return 'No';
  };

  const formatValue = (value: string) => {
    return value
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="mb-4 p-3 rounded border border-primary">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Heart className="text-primary" size={16} />
        Lifestyle
      </h4>
      <div className="space-y-2">
        {getSmokingText() && (
          <div className="flex p-2 border-b border-primary">
            <span className="pr-2">Smoking:</span>
            <span>{getSmokingText()}</span>
          </div>
        )}
        {lifestyle.alcohol && (
          <div className="flex p-2 border-b border-primary">
            <span className="pr-2">Alcohol:</span>
            <span>{formatValue(lifestyle.alcohol)}</span>
          </div>
        )}
        {lifestyle.exercise && (
          <div className="flex p-2 border-b border-primary">
            <span className="pr-2">Exercise:</span>
            <span>{formatValue(lifestyle.exercise)}</span>
          </div>
        )}
        {lifestyle.diet && (
          <div className="flex p-2 border-b border-primary">
            <span className="pr-2">Diet:</span>
            <span>{formatValue(lifestyle.diet)}</span>
          </div>
        )}
        {lifestyle.stressLevel && (
          <div className="flex p-2 border-b border-primary last:border-b-0">
            <span className="pr-2">Stress Level:</span>
            <span>{formatValue(lifestyle.stressLevel)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
