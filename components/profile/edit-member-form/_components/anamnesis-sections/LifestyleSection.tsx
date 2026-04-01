import { Lifestyle } from '@/utils/types';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('EditMemberForm.anamnesisSections.lifestyle');
  return (
    <details className="rounded border-2 border-primary p-3">
      <summary className="cursor-pointer font-semibold text-primary">{t('title')}</summary>
      <div className="mt-3 space-y-3">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(lifestyle.isSmoking)}
              onChange={e => onChange('isSmoking', e.target.checked)}
              className="checkbox checkbox-sm checkbox-primary"
            />
            {t('smoking')}
          </label>
          {lifestyle.isSmoking && (
            <input
              type="number"
              value={lifestyle.cigarettesPerDay || ''}
              onChange={e => onChange('cigarettesPerDay', e.target.value ? parseInt(e.target.value) : null)}
              placeholder={t('cigarettesPerDayPlaceholder')}
              style={{ colorScheme: 'light' }}
              className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-32"
            />
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">{t('alcohol')}</label>
            <select
              value={lifestyle.alcohol}
              onChange={e => onChange('alcohol', e.target.value as Lifestyle['alcohol'])}
              className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
            >
              <option value="NO">{t('no')}</option>
              <option value="OCCASIONALLY">{t('occasionally')}</option>
              <option value="REGULARLY">{t('regularly')}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('exercise')}</label>
            <select
              value={lifestyle.exercise}
              onChange={e => onChange('exercise', e.target.value as Lifestyle['exercise'])}
              className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
            >
              <option value="NO">{t('no')}</option>
              <option value="LITTLE">{t('little')}</option>
              <option value="MODERATE">{t('moderate')}</option>
              <option value="REGULARLY">{t('regularly')}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('diet')}</label>
            <select
              value={lifestyle.diet}
              onChange={e => onChange('diet', e.target.value as Lifestyle['diet'])}
              className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
            >
              <option value="BALANCED">{t('balanced')}</option>
              <option value="VEGETARIAN">{t('vegetarian')}</option>
              <option value="VEGAN">{t('vegan')}</option>
              <option value="UNBALANCED">{t('unbalanced')}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('stressLevel')}</label>
            <select
              value={lifestyle.stressLevel}
              onChange={e => onChange('stressLevel', e.target.value as Lifestyle['stressLevel'])}
              className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
            >
              <option value="LOW">{t('low')}</option>
              <option value="MODERATE">{t('moderate')}</option>
              <option value="HIGH">{t('high')}</option>
            </select>
          </div>
        </div>
      </div>
    </details>
  );
}
