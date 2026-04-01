'use client';

import { Heart } from 'lucide-react';
import { Lifestyle } from '@/utils/types';
import { useTranslations } from 'next-intl';

type LifestyleDisplayProps = {
  lifestyle: Lifestyle;
};

export function LifestyleDisplay({ lifestyle }: LifestyleDisplayProps) {
  const t = useTranslations('MemberProfileFull');
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
        ? `${t('anamnesisDisplay.lifestyle.yes')} (${t('anamnesisDisplay.lifestyle.cigarettesPerDay', { count: lifestyle.cigarettesPerDay })})`
        : t('anamnesisDisplay.lifestyle.yes');
    }
    return t('anamnesisDisplay.lifestyle.no');
  };

  const getLifestyleValueLabel = (value: string) => {
    const translatedKey = `anamnesisDisplay.lifestyle.${value.toLowerCase()}`;
    if (t.has(translatedKey)) {
      return t(translatedKey);
    }

    return value
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="mb-4 p-3 rounded border border-primary">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Heart className="text-primary" size={16} />
        {t('anamnesisDisplay.lifestyle.title')}
      </h4>
      <div className="space-y-2">
        {getSmokingText() && (
          <div className="flex p-2 border-b border-primary">
            <span className="pr-2">{t('anamnesisDisplay.lifestyle.smoking')}:</span>
            <span>{getSmokingText()}</span>
          </div>
        )}
        {lifestyle.alcohol && (
          <div className="flex p-2 border-b border-primary">
            <span className="pr-2">{t('anamnesisDisplay.lifestyle.alcohol')}:</span>
            <span>{getLifestyleValueLabel(lifestyle.alcohol)}</span>
          </div>
        )}
        {lifestyle.exercise && (
          <div className="flex p-2 border-b border-primary">
            <span className="pr-2">{t('anamnesisDisplay.lifestyle.exercise')}:</span>
            <span>{getLifestyleValueLabel(lifestyle.exercise)}</span>
          </div>
        )}
        {lifestyle.diet && (
          <div className="flex p-2 border-b border-primary">
            <span className="pr-2">{t('anamnesisDisplay.lifestyle.diet')}:</span>
            <span>{getLifestyleValueLabel(lifestyle.diet)}</span>
          </div>
        )}
        {lifestyle.stressLevel && (
          <div className="flex p-2 border-b border-primary last:border-b-0">
            <span className="pr-2">{t('anamnesisDisplay.lifestyle.stressLevel')}:</span>
            <span>{getLifestyleValueLabel(lifestyle.stressLevel)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
