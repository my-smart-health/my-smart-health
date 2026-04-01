import { Allergies } from '@/utils/types';
import { useTranslations } from 'next-intl';

type AllergiesSectionProps = {
  allergies: Allergies[];
  setAllergies: (val: Allergies[]) => void;
};

export function AllergiesSection({
  allergies,
  setAllergies,
}: AllergiesSectionProps) {
  const t = useTranslations('EditMemberForm.allergies');
  const handleAdd = () => {
    setAllergies([...allergies, { name: '', severity: '' }]);
  };

  const handleRemove = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof Allergies, value: string) => {
    const updated = [...allergies];
    updated[index] = { ...updated[index], [field]: value };
    setAllergies(updated);
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
            {t('addAllergy')}
          </button>
        </div>
        <div className="space-y-4">
          {allergies.length === 0 ? (
            <p className="text-gray-500 italic text-sm">{t('empty')}</p>
          ) : (
            allergies.map((allergy, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-sm text-gray-600">{t('allergyItem', { index: index + 1 })}</h4>
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
                  value={allergy.name}
                  onChange={e => handleChange(index, 'name', e.target.value)}
                  placeholder={t('namePlaceholder')}
                  className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />
                <select
                  value={allergy.severity}
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
