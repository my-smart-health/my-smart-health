import { useTranslations } from 'next-intl';

type PersonalInfoSectionProps = {
  birthday: string;
  setBirthday: (val: string) => void;
  heightCm: string;
  setHeightCm: (val: string) => void;
  weightKg: string;
  setWeightKg: (val: string) => void;
};

export function PersonalInfoSection({
  birthday,
  setBirthday,
  heightCm,
  setHeightCm,
  weightKg,
  setWeightKg,
}: PersonalInfoSectionProps) {
  const t = useTranslations('EditMemberForm.personalInfo');
  return (
    <div className="space-y-4">
      <section>
        <label className="flex flex-col gap-2">
          <span className="font-semibold text-gray-700">{t('birthday')}</span>
          <input
            type="date"
            value={birthday}
            onChange={e => setBirthday(e.target.value)}
            className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
            style={{ colorScheme: 'light' }}
          />
        </label>
      </section>

      <section>
        <label className="flex flex-col gap-2">
          <span className="font-semibold text-gray-700">{t('heightCm')}</span>
          <input
            type="number"
            value={heightCm}
            onChange={e => setHeightCm(e.target.value)}
            placeholder={t('heightPlaceholder')}
            className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
          />
        </label>
      </section>

      <section>
        <label className="flex flex-col gap-2">
          <span className="font-semibold text-gray-700">{t('weightKg')}</span>
          <input
            type="number"
            value={weightKg}
            onChange={e => setWeightKg(e.target.value)}
            placeholder={t('weightPlaceholder')}
            className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
          />
        </label>
      </section>
    </div>
  );
}
