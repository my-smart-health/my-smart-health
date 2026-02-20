import { HealthInsurances } from '@/utils/types';

type HealthInsurancesSectionProps = {
  healthInsurances: HealthInsurances[];
  setHealthInsurances: (val: HealthInsurances[]) => void;
};

export function HealthInsurancesSection({
  healthInsurances,
  setHealthInsurances,
}: HealthInsurancesSectionProps) {
  const handleAdd = () => {
    setHealthInsurances([
      ...healthInsurances,
      { provider: '', insuranceName: '', insuranceNumber: '', phone: '' },
    ]);
  };

  const handleRemove = (index: number) => {
    setHealthInsurances(healthInsurances.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof HealthInsurances, value: string) => {
    const updated = [...healthInsurances];
    updated[index] = { ...updated[index], [field]: value };
    setHealthInsurances(updated);
  };

  return (
    <section>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">Health Insurances</span>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-sm btn-primary text-white"
          >
            + Add Insurance
          </button>
        </div>
        <div className="space-y-4">
          {healthInsurances.length === 0 ? (
            <p className="text-gray-500 italic text-sm">No health insurances added yet</p>
          ) : (
            healthInsurances.map((insurance, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-sm text-gray-600">Insurance #{index + 1}</h4>
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
                  value={insurance.provider}
                  onChange={e => handleChange(index, 'provider', e.target.value)}
                  placeholder="Provider"
                  className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />
                <input
                  type="text"
                  value={insurance.insuranceName}
                  onChange={e => handleChange(index, 'insuranceName', e.target.value)}
                  placeholder="Insurance Name"
                  className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />
                <input
                  type="text"
                  value={insurance.insuranceNumber}
                  onChange={e => handleChange(index, 'insuranceNumber', e.target.value)}
                  placeholder="Insurance Number"
                  className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />
                <input
                  type="tel"
                  value={insurance.phone}
                  onChange={e => handleChange(index, 'phone', e.target.value)}
                  placeholder="Phone"
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
