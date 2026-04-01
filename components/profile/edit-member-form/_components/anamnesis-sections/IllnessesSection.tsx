import { Illnesses } from '@/utils/types';
import { useTranslations } from 'next-intl';

type IllnessesSectionProps = {
  illnesses: Illnesses;
  onChange: (field: keyof Illnesses, value: boolean | string | null) => void;
};

export function IllnessesSection({
  illnesses,
  onChange,
}: IllnessesSectionProps) {
  const t = useTranslations('EditMemberForm.anamnesisSections.illnesses');
  return (
    <details className="rounded border-2 border-primary p-3">
      <summary className="cursor-pointer font-semibold text-primary">{t('title')}</summary>
      <div className="mt-3 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { key: 'highBloodPressure', label: t('highBloodPressure') },
            { key: 'diabetes', label: t('diabetes') },
            { key: 'heartDisease', label: t('heartDisease') },
            { key: 'stroke', label: t('stroke') },
            { key: 'asthma', label: t('asthma') },
            { key: 'allergies', label: t('allergies') },
            { key: 'thyroidDisorders', label: t('thyroidDisorders') },
            { key: 'gastrointestinalDiseases', label: t('gastrointestinalDiseases') },
            { key: 'liverDisorders', label: t('liverDisorders') },
            { key: 'kidneyDiseases', label: t('kidneyDiseases') },
            { key: 'rheumatism', label: t('rheumatism') },
            { key: 'autoimmuneDiseases', label: t('autoimmuneDiseases') },
            { key: 'cancer', label: t('cancer') },
            { key: 'mentalHealthDisorders', label: t('mentalHealthDisorders') },
            { key: 'infectiousDiseases', label: t('infectiousDiseases') },
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
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('otherLabel')}</label>
          <input
            type="text"
            value={illnesses.other || ''}
            onChange={e => onChange('other', e.target.value || null)}
            placeholder={t('otherPlaceholder')}
            className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
          />
        </div>
      </div>
    </details>
  );
}
