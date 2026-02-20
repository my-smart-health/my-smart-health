import { VaccinationStatus } from '@/utils/types';

type VaccinationStatusSectionProps = {
  vaccinationStatus: VaccinationStatus;
  onChange: (field: keyof VaccinationStatus, value: boolean | string | null) => void;
};

export function VaccinationStatusSection({
  vaccinationStatus,
  onChange,
}: VaccinationStatusSectionProps) {
  return (
    <details className="rounded border-2 border-primary p-3">
      <summary className="cursor-pointer font-semibold text-primary">Vaccination Status</summary>
      <div className="mt-3 space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={vaccinationStatus.unknown === true}
            onChange={e => onChange('unknown', e.target.checked ? true : null)}
            className="checkbox checkbox-sm checkbox-primary"
          />
          Unknown
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { key: 'tetanus', label: 'Tetanus' },
            { key: 'measles', label: 'Measles' },
            { key: 'hepatitisB', label: 'Hepatitis B' },
            { key: 'influenza', label: 'Influenza' },
            { key: 'covid19', label: 'COVID-19' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={vaccinationStatus[key as keyof VaccinationStatus] === true}
                onChange={e => onChange(key as keyof VaccinationStatus, e.target.checked ? true : null)}
                className="checkbox checkbox-sm checkbox-primary"
              />
              {label}
            </label>
          ))}
        </div>
        <input
          type="text"
          value={vaccinationStatus.other || ''}
          onChange={e => onChange('other', e.target.value || null)}
          placeholder="Other vaccinations..."
          className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
        />
      </div>
    </details>
  );
}
