'use client';

import { Syringe } from 'lucide-react';
import { VaccinationStatus } from '@/utils/types';
import { useTranslations } from 'next-intl';

type VaccinationStatusDisplayProps = {
  vaccinationStatus: VaccinationStatus;
};

export function VaccinationStatusDisplay({ vaccinationStatus }: VaccinationStatusDisplayProps) {
  const t = useTranslations('MemberProfileFull');
  const vaccinationLabels: Record<keyof Omit<VaccinationStatus, 'other'>, string> = {
    tetanus: t('anamnesisDisplay.vaccination.tetanus'),
    measles: t('anamnesisDisplay.vaccination.measles'),
    hepatitisB: t('anamnesisDisplay.vaccination.hepatitisB'),
    influenza: t('anamnesisDisplay.vaccination.influenza'),
    covid19: t('anamnesisDisplay.vaccination.covid19'),
    unknown: t('anamnesisDisplay.vaccination.unknown'),
  };
  const checkedVaccinations = Object.entries(vaccinationStatus)
    .filter(([key, value]) => key !== 'other' && value === true)
    .map(([key]) => vaccinationLabels[key as keyof typeof vaccinationLabels]);

  const hasOther = vaccinationStatus.other && vaccinationStatus.other.trim() !== '';
  const hasAnyVaccination = checkedVaccinations.length > 0 || hasOther;

  if (!hasAnyVaccination) {
    return null;
  }

  return (
    <div className="mb-4 p-3 rounded border border-primary">
      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <Syringe className="text-primary" size={16} />
        {t('anamnesisDisplay.vaccination.title')}
      </h4>
      <ul className="grid grid-cols-1 gap-2">
        {checkedVaccinations.map((vaccination, index) => (
          <li key={index} className={`flex items-center gap-2 ${index < checkedVaccinations.length - 1 ? 'border-b border-primary pb-1' : ''}`}>
            <span className="text-primary">✓</span>
            {vaccination}
          </li>
        ))}
        {hasOther && (
          <li className="flex items-center gap-2 border-t border-primary pt-1" >
            <span className="text-primary">✓</span>
            {t('anamnesisDisplay.otherPrefix')}: {vaccinationStatus.other}
          </li>
        )}
      </ul>
    </div>
  );
}
