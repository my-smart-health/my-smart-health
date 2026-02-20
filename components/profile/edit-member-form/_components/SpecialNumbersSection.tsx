import { TelMedicinePhoneNumber } from '@/utils/types';

type SpecialNumbersSectionProps = {
  specialNumbers: TelMedicinePhoneNumber[];
  setSpecialNumbers: (val: TelMedicinePhoneNumber[]) => void;
};

export function SpecialNumbersSection({
  specialNumbers,
  setSpecialNumbers,
}: SpecialNumbersSectionProps) {
  const handleAdd = () => {
    setSpecialNumbers([
      ...specialNumbers,
      { type: '', phone: '', description: '' },
    ]);
  };

  const handleRemove = (index: number) => {
    setSpecialNumbers(specialNumbers.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: keyof TelMedicinePhoneNumber,
    value: string,
  ) => {
    const updated = [...specialNumbers];
    updated[index] = { ...updated[index], [field]: value };
    setSpecialNumbers(updated);
  };

  return (
    <section>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">Special Numbers</span>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-sm btn-primary text-white"
          >
            + Add Number
          </button>
        </div>

        <div className="space-y-4">
          {specialNumbers.length === 0 ? (
            <p className="text-gray-500 italic text-sm">No special numbers added yet</p>
          ) : (
            specialNumbers.map((item, index) => (
              <div
                key={index}
                className="p-4 border border-gray-300 rounded-lg space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-sm text-gray-600">
                    Number #{index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="btn btn-xs btn-error text-white"
                  >
                    Remove
                  </button>
                </div>

                <input
                  type="text"
                  value={item.type}
                  onChange={(e) => handleChange(index, 'type', e.target.value)}
                  placeholder="Type (e.g. Video Doctor, Emergency Hotline)"
                  className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />

                <input
                  type="tel"
                  value={item.phone}
                  onChange={(e) => handleChange(index, 'phone', e.target.value)}
                  placeholder="Phone number"
                  className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />

                <input
                  type="text"
                  value={item.description || ''}
                  onChange={(e) =>
                    handleChange(index, 'description', e.target.value)
                  }
                  placeholder="Description (optional)"
                  className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
