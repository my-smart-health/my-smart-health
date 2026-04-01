import { HospitalStays } from '@/utils/types';
import { useTranslations } from 'next-intl';

type HospitalStaysSectionProps = {
  hospitalStays: HospitalStays[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof HospitalStays, value: string | number) => void;
};

export function HospitalStaysSection({
  hospitalStays,
  onAdd,
  onRemove,
  onChange,
}: HospitalStaysSectionProps) {
  const t = useTranslations('EditMemberForm.anamnesisSections.hospitalStays');
  return (
    <details className="rounded border-2 border-primary p-3">
      <summary className="cursor-pointer font-semibold text-primary">{t('title')}</summary>
      <div className="mt-3 space-y-2">
        <button
          type="button"
          onClick={onAdd}
          className="btn btn-xs btn-primary text-white"
        >
          {t('addHospitalStay')}
        </button>
        {hospitalStays.map((stay, stayIndex) => (
          <div key={stayIndex} className="p-3 rounded space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold">{t('stayItem', { index: stayIndex + 1 })}</span>
              <button
                type="button"
                onClick={() => onRemove(stayIndex)}
                className="btn btn-xs btn-error text-white"
              >
                {t('remove')}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="number"
                value={stay.year}
                onChange={e => onChange(stayIndex, 'year', parseInt(e.target.value))}
                placeholder={t('yearPlaceholder')}
                style={{ colorScheme: 'light' }}
                className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
              <input
                type="text"
                value={stay.treatment}
                onChange={e => onChange(stayIndex, 'treatment', e.target.value)}
                placeholder={t('treatmentPlaceholder')}

                className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
              <input
                type="text"
                value={stay.hospital}
                onChange={e => onChange(stayIndex, 'hospital', e.target.value)}
                placeholder={t('hospitalPlaceholder')}
                className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}
