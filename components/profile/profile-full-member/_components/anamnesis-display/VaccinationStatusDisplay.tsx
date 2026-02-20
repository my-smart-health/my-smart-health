import { Syringe } from 'lucide-react';
import { VaccinationStatus } from '@/utils/types';

type VaccinationStatusDisplayProps = {
  vaccinationStatus: VaccinationStatus;
};

const vaccinationLabels: Record<keyof Omit<VaccinationStatus, 'other'>, string> = {
  tetanus: 'Tetanus',
  measles: 'Measles',
  hepatitisB: 'Hepatitis B',
  influenza: 'Influenza',
  covid19: 'COVID-19',
  unknown: 'Unknown',
};

export function VaccinationStatusDisplay({ vaccinationStatus }: VaccinationStatusDisplayProps) {
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
        Vaccination Status
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
            Other: {vaccinationStatus.other}
          </li>
        )}
      </ul>
    </div>
  );
}
