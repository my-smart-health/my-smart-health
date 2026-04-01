import { FamilyMember } from '@/utils/types';
import { useTranslations } from 'next-intl';

type FamilyMembersSectionProps = {
  familyMembers: FamilyMember[];
  setFamilyMembers: (val: FamilyMember[]) => void;
};

export function FamilyMembersSection({
  familyMembers,
  setFamilyMembers,
}: FamilyMembersSectionProps) {
  const t = useTranslations('EditMemberForm.familyMembers');
  const handleAdd = () => {
    setFamilyMembers([...familyMembers, { name: '', phones: [] }]);
  };

  const handleRemove = (index: number) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: 'name', value: string) => {
    const updated = [...familyMembers];
    updated[index] = { ...updated[index], [field]: value };
    setFamilyMembers(updated);
  };

  const handleAddPhone = (index: number) => {
    const updated = [...familyMembers];
    updated[index] = {
      ...updated[index],
      phones: [...updated[index].phones, ''],
    };
    setFamilyMembers(updated);
  };

  const handleRemovePhone = (memberIndex: number, phoneIndex: number) => {
    const updated = [...familyMembers];
    updated[memberIndex] = {
      ...updated[memberIndex],
      phones: updated[memberIndex].phones.filter((_, i) => i !== phoneIndex),
    };
    setFamilyMembers(updated);
  };

  const handlePhoneChange = (memberIndex: number, phoneIndex: number, value: string) => {
    const updated = [...familyMembers];
    const updatedPhones = [...updated[memberIndex].phones];
    updatedPhones[phoneIndex] = value;
    updated[memberIndex] = { ...updated[memberIndex], phones: updatedPhones };
    setFamilyMembers(updated);
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
            {t('addFamilyMember')}
          </button>
        </div>
        <div className="space-y-4">
          {familyMembers.length === 0 ? (
            <p className="text-gray-500 italic text-sm">{t('empty')}</p>
          ) : (
            familyMembers.map((member, memberIndex) => (
              <div key={memberIndex} className="p-4 border border-gray-300 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-sm text-gray-600">{t('familyMemberItem', { index: memberIndex + 1 })}</h4>
                  <button
                    type="button"
                    onClick={() => handleRemove(memberIndex)}
                    className="btn btn-xs btn-error text-white"
                  >
                    {t('remove')}
                  </button>
                </div>
                <input
                  type="text"
                  value={member.name}
                  onChange={e => handleChange(memberIndex, 'name', e.target.value)}
                  placeholder={t('namePlaceholder')}
                  className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{t('phoneNumbers')}</span>
                    <button
                      type="button"
                      onClick={() => handleAddPhone(memberIndex)}
                      className="btn btn-xs btn-primary text-white"
                    >
                      {t('addPhone')}
                    </button>
                  </div>
                  {member.phones.map((phone, phoneIndex) => (
                    <div key={phoneIndex} className="flex gap-2">
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => handlePhoneChange(memberIndex, phoneIndex, e.target.value)}
                        placeholder={t('phonePlaceholder')}
                        className="p-2 rounded border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-primary flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhone(memberIndex, phoneIndex)}
                        className="btn btn-xs btn-error text-white"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
