import { useTranslations } from 'next-intl';

type BasicInfoSectionProps = {
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  memberId: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  isAdmin?: boolean;
  phoneNumbers: string[];
  setPhoneNumbers: (val: string[]) => void;

};

export function BasicInfoSection({
  name,
  setName,
  email,
  setEmail,
  memberId,
  role,
  createdAt,
  updatedAt,
  isAdmin = false,
  phoneNumbers,
  setPhoneNumbers,
}: BasicInfoSectionProps) {
  const t = useTranslations('EditMemberForm.basicInfo');
  return (
    <div className="space-y-4">
      {isAdmin && (
        <>
          <section>
            <label className="flex flex-col gap-2">
              <span className="font-semibold text-gray-700">{t('memberId')}</span>
              <input
                type="text"
                value={memberId}
                disabled
                className="p-3 rounded border border-gray-300 bg-gray-100 text-base focus:outline-none w-full cursor-not-allowed"
              />
            </label>
          </section>

          <section>
            <label className="flex flex-col gap-2">
              <span className="font-semibold text-gray-700">{t('role')}</span>
              <input
                type="text"
                value={role}
                disabled
                className="p-3 rounded border border-gray-300 bg-gray-100 text-base focus:outline-none w-full cursor-not-allowed"
              />
            </label>
          </section>
        </>
      )}

      <section>
        <label className="flex flex-col gap-2">
          <span className="font-semibold text-gray-700">{t('email')}</span>
          <input
            type="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
          />
        </label>
      </section>

      <section>
        <label className="flex flex-col gap-2">
          <span className="font-semibold text-gray-700">{t('name')}</span>
          <input
            type="text"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
          />
        </label>
      </section>


      <section>
        <label className="flex flex-col gap-2">
          <span className="font-semibold text-gray-700">{t('phoneNumbers')}</span>

          <div className="flex flex-col gap-2">
            {phoneNumbers.map((phone, index) => (
              <div key={`phone-${index}`} className="flex items-center gap-2">
                <input
                  type="tel"
                  key={`phone-${index}`}
                  name={`phoneNumbers[${index}]`}
                  value={phone}
                  placeholder={t('phonePlaceholder')}
                  onChange={e => {
                    const newPhones = [...phoneNumbers];
                    newPhones[index] = e.target.value;
                    setPhoneNumbers(newPhones);
                  }}
                  className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />
                <button
                  type="button"
                  onClick={() => setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index))}
                  className="btn btn-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {t('removePhone')}
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPhoneNumbers([...phoneNumbers, ""])}
                className="btn btn-sm px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {t('addPhone')}
              </button>
            </div>
          </div>
        </label>
      </section>


      {isAdmin && (
        <>
          <section>
            <label className="flex flex-col gap-2">
              <span className="font-semibold text-gray-700">{t('createdAt')}</span>
              <input
                type="text"
                value={createdAt}
                disabled
                className="p-3 rounded border border-gray-300 bg-gray-100 text-base focus:outline-none w-full cursor-not-allowed"
              />
            </label>
          </section>

          <section>
            <label className="flex flex-col gap-2">
              <span className="font-semibold text-gray-700">{t('updatedAt')}</span>
              <input
                type="text"
                value={updatedAt}
                disabled
                className="p-3 rounded border border-gray-300 bg-gray-100 text-base focus:outline-none w-full cursor-not-allowed"
              />
            </label>
          </section>
        </>
      )}
    </div>
  );
}
