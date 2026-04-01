'use client';

import { Users } from 'lucide-react';
import { FamilyHistoryOfIllness } from '@/utils/types';
import { useTranslations } from 'next-intl';

type FamilyHistoryDisplayProps = {
  familyHistory: FamilyHistoryOfIllness;
};

export function FamilyHistoryDisplay({ familyHistory }: FamilyHistoryDisplayProps) {
  const t = useTranslations('MemberProfileFull');
  const familyHistoryLabels: Record<keyof Omit<FamilyHistoryOfIllness, 'noKnownRelevantIllnesses'>, string> = {
    cardiovascularDisease: t('anamnesisDisplay.familyHistory.cardiovascularDisease'),
    diabetes: t('anamnesisDisplay.familyHistory.diabetes'),
    cancer: t('anamnesisDisplay.familyHistory.cancer'),
    hereditaryDiseases: t('anamnesisDisplay.familyHistory.hereditaryDiseases'),
    mentalHealthConditions: t('anamnesisDisplay.familyHistory.mentalHealthConditions'),
  };
  if (familyHistory.noKnownRelevantIllnesses) {
    return null;
  }

  const checkedConditions = Object.entries(familyHistory)
    .filter(([key, value]) => key !== 'noKnownRelevantIllnesses' && value === true)
    .map(([key]) => familyHistoryLabels[key as keyof typeof familyHistoryLabels]);

  if (checkedConditions.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-3 rounded border border-primary">
      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <Users className="text-primary" size={16} />
        {t('anamnesisDisplay.familyHistory.title')}
      </h4>
      <ul className="space-y-1">
        {checkedConditions.map((condition, index) => (
          <li key={index} className={`flex items-center gap-2 ${index < checkedConditions.length - 1 ? 'border-b border-primary pb-1' : ''}`}>
            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
            {condition}
          </li>
        ))}
      </ul>
    </div>
  );
}
