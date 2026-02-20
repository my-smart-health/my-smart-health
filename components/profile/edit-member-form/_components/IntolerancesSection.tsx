import { Intolerances } from '@/utils/types';

type IntolerancesSectionProps = {
  intolerances: Intolerances[];
  setIntolerances: (val: Intolerances[]) => void;
};

export function IntolerancesSection({
  intolerances,
  setIntolerances,
}: IntolerancesSectionProps) {
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
          <span className="font-semibold text-gray-700">Intolerances</span>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-sm btn-primary text-white"
          >
            + Add Intolerance
          </button>
        </div>
        <div className="space-y-4">
          {intolerances.length === 0 ? (
            <p className="text-gray-500 italic text-sm">No intolerances added yet</p>
          ) : (
            intolerances.map((intolerance, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-sm text-gray-600">Intolerance #{index + 1}</h4>
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
                  value={intolerance.name}
                  onChange={e => handleChange(index, 'name', e.target.value)}
                  placeholder="Intolerance Name (e.g., Lactose)"
                  className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />
                <select
                  value={intolerance.severity}
                  onChange={e => handleChange(index, 'severity', e.target.value)}
                  className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
                >
                  <option value="">Select Severity</option>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
