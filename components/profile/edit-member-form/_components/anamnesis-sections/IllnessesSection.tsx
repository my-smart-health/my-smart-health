import { Illnesses } from '@/utils/types';

type IllnessesSectionProps = {
  illnesses: Illnesses;
  onChange: (field: keyof Illnesses, value: boolean | string | null) => void;
};

export function IllnessesSection({
  illnesses,
  onChange,
}: IllnessesSectionProps) {
  return (
    <details className="rounded border-2 border-primary p-3">
      <summary className="cursor-pointer font-semibold text-primary">Illnesses</summary>
      <div className="mt-3 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { key: 'highBloodPressure', label: 'High Blood Pressure' },
            { key: 'diabetes', label: 'Diabetes' },
            { key: 'heartDisease', label: 'Heart Disease' },
            { key: 'stroke', label: 'Stroke' },
            { key: 'asthma', label: 'Asthma' },
            { key: 'allergies', label: 'Allergies' },
            { key: 'thyroidDisorders', label: 'Thyroid Disorders' },
            { key: 'gastrointestinalDiseases', label: 'Gastrointestinal Diseases' },
            { key: 'liverDisorders', label: 'Liver Disorders' },
            { key: 'kidneyDiseases', label: 'Kidney Diseases' },
            { key: 'rheumatism', label: 'Rheumatism' },
            { key: 'autoimmuneDiseases', label: 'Autoimmune Diseases' },
            { key: 'cancer', label: 'Cancer' },
            { key: 'mentalHealthDisorders', label: 'Mental Health Disorders' },
            { key: 'infectiousDiseases', label: 'Infectious Diseases' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={illnesses[key as keyof Omit<Illnesses, 'other'>] === true}
                onChange={e => onChange(key as keyof Illnesses, e.target.checked ? true : null)}
                className="checkbox checkbox-sm checkbox-primary"
              />
              {label}
            </label>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Other</label>
          <input
            type="text"
            value={illnesses.other || ''}
            onChange={e => onChange('other', e.target.value || null)}
            placeholder="Other illnesses..."
            className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
          />
        </div>
      </div>
    </details>
  );
}
