import { Lifestyle } from '@/utils/types';

type LifestyleChangeHandler = <K extends keyof Lifestyle>(
  field: K,
  value: Lifestyle[K],
) => void;

type LifestyleSectionProps = {
  lifestyle: Lifestyle;
  onChange: LifestyleChangeHandler;
};

export function LifestyleSection({
  lifestyle,
  onChange,
}: LifestyleSectionProps) {
  return (
    <details className="rounded border-2 border-primary p-3">
      <summary className="cursor-pointer font-semibold text-primary">Lifestyle</summary>
      <div className="mt-3 space-y-3">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(lifestyle.isSmoking)}
              onChange={e => onChange('isSmoking', e.target.checked)}
              className="checkbox checkbox-sm checkbox-primary"
            />
            Smoking
          </label>
          {lifestyle.isSmoking && (
            <input
              type="number"
              value={lifestyle.cigarettesPerDay || ''}
              onChange={e => onChange('cigarettesPerDay', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Cigarettes/day"
              style={{ colorScheme: 'light' }}
              className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-32"
            />
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">Alcohol</label>
            <select
              value={lifestyle.alcohol}
              onChange={e => onChange('alcohol', e.target.value as Lifestyle['alcohol'])}
              className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
            >
              <option value="NO">No</option>
              <option value="OCCASIONALLY">Occasionally</option>
              <option value="REGULARLY">Regularly</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Exercise</label>
            <select
              value={lifestyle.exercise}
              onChange={e => onChange('exercise', e.target.value as Lifestyle['exercise'])}
              className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
            >
              <option value="NO">No</option>
              <option value="LITTLE">Little</option>
              <option value="MODERATE">Moderate</option>
              <option value="REGULARLY">Regularly</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Diet</label>
            <select
              value={lifestyle.diet}
              onChange={e => onChange('diet', e.target.value as Lifestyle['diet'])}
              className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
            >
              <option value="BALANCED">Balanced</option>
              <option value="VEGETARIAN">Vegetarian</option>
              <option value="VEGAN">Vegan</option>
              <option value="UNBALANCED">Unbalanced</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Stress Level</label>
            <select
              value={lifestyle.stressLevel}
              onChange={e => onChange('stressLevel', e.target.value as Lifestyle['stressLevel'])}
              className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
            >
              <option value="LOW">Low</option>
              <option value="MODERATE">Moderate</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>
      </div>
    </details>
  );
}
