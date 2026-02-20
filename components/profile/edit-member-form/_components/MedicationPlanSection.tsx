import { MedicationPlanTable, FileWithDescription } from '@/utils/types';

type MedicationPlanSectionProps = {
  medicationPlan: MedicationPlanTable[];
  setMedicationPlan: (val: MedicationPlanTable[]) => void;
};

export function MedicationPlanSection({
  medicationPlan,
  setMedicationPlan,
}: MedicationPlanSectionProps) {
  const handleAdd = () => {
    setMedicationPlan([
      ...medicationPlan,
      { medication: '', dosage: '', sinceWhen: '', reason: '', fileUrl: [] },
    ]);
  };

  const handleRemove = (index: number) => {
    setMedicationPlan(medicationPlan.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof Omit<MedicationPlanTable, 'fileUrl'>, value: string) => {
    const updated = [...medicationPlan];
    updated[index] = { ...updated[index], [field]: value };
    setMedicationPlan(updated);
  };

  const handleAddFileUrl = (index: number) => {
    const updated = [...medicationPlan];
    const existingFileUrls = updated[index].fileUrl ?? [];
    updated[index] = {
      ...updated[index],
      fileUrl: [...existingFileUrls, { url: '', description: '' }],
    };
    setMedicationPlan(updated);
  };

  const handleRemoveFileUrl = (medIndex: number, fileIndex: number) => {
    const updated = [...medicationPlan];
    const existingFileUrls = updated[medIndex].fileUrl ?? [];
    updated[medIndex] = {
      ...updated[medIndex],
      fileUrl: existingFileUrls.filter((_, i) => i !== fileIndex),
    };
    setMedicationPlan(updated);
  };

  const handleFileUrlChange = (medIndex: number, fileIndex: number, field: keyof FileWithDescription, value: string) => {
    const updated = [...medicationPlan];
    const existingFileUrls = updated[medIndex].fileUrl ?? [];
    const updatedUrls = [...existingFileUrls];
    updatedUrls[fileIndex] = { ...updatedUrls[fileIndex], [field]: value };
    updated[medIndex] = { ...updated[medIndex], fileUrl: updatedUrls };
    setMedicationPlan(updated);
  };

  return (
    <section>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">Medication Plan</span>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-sm btn-primary text-white"
          >
            + Add Medication
          </button>
        </div>
        <div className="space-y-4">
          {medicationPlan.length === 0 ? (
            <p className="text-gray-500 italic text-sm">No medications added yet</p>
          ) : (
            medicationPlan.map((med, medIndex) => (
              <div key={medIndex} className="p-4 border border-gray-300 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-sm text-gray-600">Medication #{medIndex + 1}</h4>
                  <button
                    type="button"
                    onClick={() => handleRemove(medIndex)}
                    className="btn btn-xs btn-error text-white"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={med.medication}
                  onChange={e => handleChange(medIndex, 'medication', e.target.value)}
                  placeholder="Medication Name"
                  className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
                />
                <input
                  type="date"
                  value={med.sinceWhen}
                  onChange={e => handleChange(medIndex, 'sinceWhen', e.target.value)}
                  placeholder="Since when"
                  className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
                  style={{ colorScheme: 'light' }}
                />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">File URLs</span>
                    <button
                      type="button"
                      onClick={() => handleAddFileUrl(medIndex)}
                      className="btn btn-xs btn-primary text-white"
                    >
                      + Add URL
                    </button>
                  </div>
                  {(med.fileUrl ?? []).map((file, fileIndex) => (
                    <div key={fileIndex} className="flex flex-col gap-2 p-2 bg-gray-50 rounded">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={file.url}
                          onChange={e => handleFileUrlChange(medIndex, fileIndex, 'url', e.target.value)}
                          placeholder="Enter file URL"
                          className="p-2 rounded border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-primary flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFileUrl(medIndex, fileIndex)}
                          className="btn btn-xs btn-error text-white"
                        >
                          x
                        </button>
                      </div>
                      <input
                        type="text"
                        value={file.description || ''}
                        onChange={e => handleFileUrlChange(medIndex, fileIndex, 'description', e.target.value)}
                        placeholder="Description (optional)"
                        className="p-2 rounded border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
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
