import { Intolerances } from '@/utils/types';
import { useTranslations } from 'next-intl';

type IntolerancesSectionProps = {
  intolerances: Intolerances[];
  setIntolerances: (val: Intolerances[]) => void;
};

export function IntolerancesSection({
  intolerances,
  setIntolerances,
}: IntolerancesSectionProps) {
  const t = useTranslations('EditMemberForm.intolerances');
  const handleAdd = () => {
    setIntolerances([...intolerances, { name: '', severity: '' }]);
  };

  const handleRemove = (index: number) => {
    setIntolerances(intolerances.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof Intolerances, value: string) => {
    const updated = [...intolerances];
    updated[index] = { ...updated[index], [field]: value };
    setIntolerances(updated);
  };

  return (
    <section>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">{t('title')}</span>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-sm btn-primary text-white"
          >
            {t('addIntolerance')}
          </button>
        </div>
        <div className="space-y-4">
          {intolerances.length === 0 ? (
            <p className="text-gray-500 italic text-sm">{t('empty')}</p>
          ) : (
            intolerances.map((intolerance, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-sm text-gray-600">{t('intoleranceItem', { index: index + 1 })}</h4>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="btn btn-xs btn-error text-white"
                  >
                    {t('remove')}
                  </button>
                </div>
                <input
                  type="text"
                  value={intolerance.name}
                  onChange={e => handleChange(index, 'name', e.target.value)}
                  placeholder={t('namePlaceholder')}
                  className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />
                <select
                  value={intolerance.severity}
                  onChange={e => handleChange(index, 'severity', e.target.value)}
                  className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
                >
                  <option value="">{t('selectSeverity')}</option>
                  <option value="mild">{t('severityMild')}</option>
                  <option value="moderate">{t('severityModerate')}</option>
                  <option value="severe">{t('severitySevere')}</option>
                </select>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
