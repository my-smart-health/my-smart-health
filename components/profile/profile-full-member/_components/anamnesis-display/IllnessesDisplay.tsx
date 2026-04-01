'use client';

import { Stethoscope } from 'lucide-react';
import { Illnesses } from '@/utils/types';
import { useTranslations } from 'next-intl';

type IllnessesDisplayProps = {
  illnesses: Illnesses;
};

export function IllnessesDisplay({ illnesses }: IllnessesDisplayProps) {
  const t = useTranslations('MemberProfileFull');
  const illnessLabels: Record<keyof Omit<Illnesses, 'other'>, string> = {
    highBloodPressure: t('anamnesisDisplay.illnesses.highBloodPressure'),
    diabetes: t('anamnesisDisplay.illnesses.diabetes'),
    heartDisease: t('anamnesisDisplay.illnesses.heartDisease'),
    stroke: t('anamnesisDisplay.illnesses.stroke'),
    asthma: t('anamnesisDisplay.illnesses.asthma'),
    allergies: t('anamnesisDisplay.illnesses.allergies'),
    thyroidDisorders: t('anamnesisDisplay.illnesses.thyroidDisorders'),
    gastrointestinalDiseases: t('anamnesisDisplay.illnesses.gastrointestinalDiseases'),
    liverDisorders: t('anamnesisDisplay.illnesses.liverDisorders'),
    kidneyDiseases: t('anamnesisDisplay.illnesses.kidneyDiseases'),
    rheumatism: t('anamnesisDisplay.illnesses.rheumatism'),
    autoimmuneDiseases: t('anamnesisDisplay.illnesses.autoimmuneDiseases'),
    cancer: t('anamnesisDisplay.illnesses.cancer'),
    mentalHealthDisorders: t('anamnesisDisplay.illnesses.mentalHealthDisorders'),
    infectiousDiseases: t('anamnesisDisplay.illnesses.infectiousDiseases'),
  };
  const checkedIllnesses = Object.entries(illnesses)
    .filter(([key, value]) => key !== 'other' && value === true)
    .map(([key]) => illnessLabels[key as keyof typeof illnessLabels]);

  const hasOther = illnesses.other && illnesses.other.trim() !== '';
  const hasAnyIllness = checkedIllnesses.length > 0 || hasOther;

  if (!hasAnyIllness) {
    return null;
  }

  return (
    <div className="mb-4 p-3 rounded border border-primary">
      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <Stethoscope className="text-primary" size={16} />
        {t('anamnesisDisplay.illnesses.title')}
      </h4>
      <ul className="space-y-1">
        {checkedIllnesses.map((illness, index) => (
          <li key={index} className={`flex items-center gap-2 ${index < checkedIllnesses.length - 1 ? 'border-b border-primary pb-1' : ''}`}>
            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
            {illness}
          </li>
        ))}
        {hasOther && (
          <li key="other" className="flex items-center gap-2 border-t border-primary pt-1">
            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
            {t('anamnesisDisplay.otherPrefix')}: {illnesses.other}
          </li>
        )}
      </ul>
    </div>
  );
}
