'use client';

import { AlertCircle } from 'lucide-react';
import { AllergiesIntolerances } from '@/utils/types';
import { useTranslations } from 'next-intl';

type AllergiesIntolerancesDisplayProps = {
  allergiesIntolerances: AllergiesIntolerances;
};

export function AllergiesIntolerancesDisplay({ allergiesIntolerances }: AllergiesIntolerancesDisplayProps) {
  const t = useTranslations('MemberProfileFull');
  if (allergiesIntolerances.noneKnown) {
    return null;
  }

  const allergies: string[] = [];

  if (allergiesIntolerances.medications) allergies.push(t('anamnesisDisplay.allergies.medications'));
  if (allergiesIntolerances.foods) allergies.push(t('anamnesisDisplay.allergies.foods'));
  if (allergiesIntolerances.pollen) allergies.push(t('anamnesisDisplay.allergies.pollen'));
  if (allergiesIntolerances.petHair) allergies.push(t('anamnesisDisplay.allergies.petHair'));
  if (allergiesIntolerances.other && allergiesIntolerances.other.trim() !== '') {
    allergies.push(`${t('anamnesisDisplay.otherPrefix')}: ${allergiesIntolerances.other}`);
  }

  if (allergies.length === 0 && !allergiesIntolerances.typeOfReaction) {
    return null;
  }

  return (
    <div className="mb-4 p-3 rounded border border-primary">
      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <AlertCircle className="text-primary" size={16} />
        {t('anamnesisDisplay.allergies.title')}
      </h4>

      {allergies.length > 0 && (
        <ul className="space-y-1 mb-3">
          {allergies.map((allergy, index) => (
            <li key={index} className={`flex items-center gap-2 ${index < allergies.length - 1 ? 'border-b border-primary pb-1' : ''}`}>
              <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
              {allergy}
            </li>
          ))}
        </ul>
      )}

      {allergiesIntolerances.typeOfReaction && allergiesIntolerances.typeOfReaction.trim() !== '' && (
        <div className="pt-2">
          <p className="text-xs text-gray-700">
            <span className="font-semibold">{t('anamnesisDisplay.allergies.typeOfReaction')}:</span> {allergiesIntolerances.typeOfReaction}
          </p>
        </div>
      )}
    </div>
  );
}
