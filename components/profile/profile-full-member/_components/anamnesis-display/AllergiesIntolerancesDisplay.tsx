import { AlertCircle } from 'lucide-react';
import { AllergiesIntolerances } from '@/utils/types';

type AllergiesIntolerancesDisplayProps = {
  allergiesIntolerances: AllergiesIntolerances;
};

export function AllergiesIntolerancesDisplay({ allergiesIntolerances }: AllergiesIntolerancesDisplayProps) {
  if (allergiesIntolerances.noneKnown) {
    return null;
  }

  const allergies: string[] = [];

  if (allergiesIntolerances.medications) allergies.push('Medications');
  if (allergiesIntolerances.foods) allergies.push('Foods');
  if (allergiesIntolerances.pollen) allergies.push('Pollen');
  if (allergiesIntolerances.petHair) allergies.push('Pet Hair');
  if (allergiesIntolerances.other && allergiesIntolerances.other.trim() !== '') {
    allergies.push(`Other: ${allergiesIntolerances.other}`);
  }

  if (allergies.length === 0 && !allergiesIntolerances.typeOfReaction) {
    return null;
  }

  return (
    <div className="mb-4 p-3 rounded border border-primary">
      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <AlertCircle className="text-primary" size={16} />
        Allergies & Intolerances
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
            <span className="font-semibold">Type of Reaction:</span> {allergiesIntolerances.typeOfReaction}
          </p>
        </div>
      )}
    </div>
  );
}
