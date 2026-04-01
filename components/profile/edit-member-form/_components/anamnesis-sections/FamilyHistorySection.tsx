import { FamilyHistoryOfIllness } from '@/utils/types';
import { useTranslations } from 'next-intl';

type FamilyHistorySectionProps = {
  familyHistory: FamilyHistoryOfIllness;
  onChange: (field: keyof FamilyHistoryOfIllness, value: boolean | null) => void;
};

export function FamilyHistorySection({
  familyHistory,
  onChange,
}: FamilyHistorySectionProps) {
  const t = useTranslations('EditMemberForm.anamnesisSections.familyHistory');
  return (
    <details className="rounded border-2 border-primary p-3">
      <summary className="cursor-pointer font-semibold text-primary">{t('title')}</summary>
      <div className="mt-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { key: 'cardiovascularDisease', label: t('cardiovascularDisease') },
            { key: 'diabetes', label: t('diabetes') },
            { key: 'cancer', label: t('cancer') },
            { key: 'hereditaryDiseases', label: t('hereditaryDiseases') },
            { key: 'mentalHealthConditions', label: t('mentalHealthConditions') },
            { key: 'noKnownRelevantIllnesses', label: t('noKnownRelevantIllnesses') },
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
