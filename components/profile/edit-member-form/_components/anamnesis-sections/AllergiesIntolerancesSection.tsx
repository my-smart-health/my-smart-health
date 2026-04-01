import { AllergiesIntolerances } from '@/utils/types';
import { useTranslations } from 'next-intl';

type AllergiesIntolerancesSectionProps = {
  allergiesIntolerances: AllergiesIntolerances;
  onChange: (field: keyof AllergiesIntolerances, value: boolean | string | null) => void;
};

export function AllergiesIntolerancesSection({
  allergiesIntolerances,
  onChange,
}: AllergiesIntolerancesSectionProps) {
  const t = useTranslations('EditMemberForm.anamnesisSections.allergiesIntolerances');
  return (
    <details className="rounded border-2 border-primary p-3">
      <summary className="cursor-pointer font-semibold text-primary">{t('title')}</summary>
      <div className="mt-3 space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={allergiesIntolerances.noneKnown === true}
            onChange={e => onChange('noneKnown', e.target.checked ? true : null)}
            className="checkbox checkbox-sm checkbox-primary"
          />
          {t('noneKnown')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { key: 'medications', label: t('medications') },
            { key: 'foods', label: t('foods') },
            { key: 'pollen', label: t('pollen') },
            { key: 'petHair', label: t('petHair') },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={allergiesIntolerances[key as keyof AllergiesIntolerances] === true}
                onChange={e => onChange(key as keyof AllergiesIntolerances, e.target.checked ? true : null)}
                disabled={allergiesIntolerances.noneKnown === true}
                className="checkbox checkbox-sm checkbox-primary"
              />
              {label}
            </label>
          ))}
        </div>
        <input
          type="text"
          value={allergiesIntolerances.other || ''}
          onChange={e => onChange('other', e.target.value || null)}
          placeholder={t('otherPlaceholder')}
          className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
        />
        <input
          type="text"
          value={allergiesIntolerances.typeOfReaction || ''}
          onChange={e => onChange('typeOfReaction', e.target.value || null)}
          placeholder={t('reactionPlaceholder')}
          className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
        />
      </div>
    </details>
  );
}
