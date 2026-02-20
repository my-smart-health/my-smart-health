import { FamilyHistoryOfIllness } from '@/utils/types';

type FamilyHistorySectionProps = {
  familyHistory: FamilyHistoryOfIllness;
  onChange: (field: keyof FamilyHistoryOfIllness, value: boolean | null) => void;
};

export function FamilyHistorySection({
  familyHistory,
  onChange,
}: FamilyHistorySectionProps) {
  return (
    <details className="rounded border-2 border-primary p-3">
      <summary className="cursor-pointer font-semibold text-primary">Family History of Illnesses</summary>
      <div className="mt-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { key: 'cardiovascularDisease', label: 'Cardiovascular Disease' },
            { key: 'diabetes', label: 'Diabetes' },
            { key: 'cancer', label: 'Cancer' },
            { key: 'hereditaryDiseases', label: 'Hereditary Diseases' },
            { key: 'mentalHealthConditions', label: 'Mental Health Conditions' },
            { key: 'noKnownRelevantIllnesses', label: 'No Known Relevant Illnesses' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={familyHistory[key as keyof FamilyHistoryOfIllness] === true}
                onChange={e => onChange(key as keyof FamilyHistoryOfIllness, e.target.checked ? true : null)}
                disabled={key !== 'noKnownRelevantIllnesses' && familyHistory.noKnownRelevantIllnesses === true}
                className="checkbox checkbox-sm checkbox-primary"
              />
              {label}
            </label>
          ))}
        </div>
      </div>
    </details>
  );
}
