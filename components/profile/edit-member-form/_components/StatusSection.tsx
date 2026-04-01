import { useTranslations } from 'next-intl';

type StatusSectionProps = {
  isActive: boolean;
  setIsActive: (val: boolean) => void;
  activeUntil: string;
  setActiveUntil: (val: string) => void;
};

export function StatusSection({
  isActive,
  setIsActive,
  activeUntil,
  setActiveUntil,
}: StatusSectionProps) {
  const t = useTranslations('EditMemberForm.status');
  return (
    <div className="space-y-4">
      <section>
        <label className="flex items-center gap-4 cursor-pointer">
          <span className="font-semibold text-gray-700 flex-1">{t('active')}</span>
          <input
            type="checkbox"
            checked={isActive}
            onChange={e => setIsActive(e.target.checked)}
            className="toggle toggle-success"
          />
        </label>
      </section>

      <section>
        <label className="flex flex-col gap-2">
          <span className="font-semibold text-gray-700">{t('activeUntil')}</span>
          <input
            type="date"
            value={activeUntil}
            onChange={e => setActiveUntil(e.target.value)}
            className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
            style={{ colorScheme: 'light' }}
          />
        </label>
      </section>
    </div>
  );
}
