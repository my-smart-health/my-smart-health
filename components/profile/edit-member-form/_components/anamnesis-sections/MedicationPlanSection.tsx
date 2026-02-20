import { MedicationPlan, MedicationPlanTable, FileWithDescription } from '@/utils/types';

type MedicationPlanSectionProps = {
  medicationPlan: MedicationPlan;
  onAddMedication: () => void;
  onRemoveMedication: (index: number) => void;
  onMedicationChange: (index: number, field: keyof MedicationPlanTable, value: string) => void;
  onNoRegularMedicationsChange: (value: boolean | null) => void;
  onAddFile: (medIndex: number) => void;
  onRemoveFile: (medIndex: number, fileIndex: number) => void;
  onFileChange: (medIndex: number, fileIndex: number, field: keyof FileWithDescription, value: string) => void;
};

export function MedicationPlanSection({
  medicationPlan,
  onAddMedication,
  onRemoveMedication,
  onMedicationChange,
  onNoRegularMedicationsChange,
  onAddFile,
  onRemoveFile,
  onFileChange,
}: MedicationPlanSectionProps) {
  return (
    <details className="rounded border-2 border-primary p-3">
      <summary className="cursor-pointer font-semibold text-primary">Medication Plan</summary>
      <div className="mt-3 space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={medicationPlan.noRegularMedications === true}
            onChange={e => onNoRegularMedicationsChange(e.target.checked ? true : null)}
            className="checkbox checkbox-sm checkbox-primary"
          />
          No Regular Medications
        </label>
        <button
          type="button"
          onClick={onAddMedication}
          className="btn btn-xs btn-primary text-white"
        >
          + Add Medication
        </button>
        {medicationPlan.medicationPlanTable.map((med, medIndex) => (
          <div key={medIndex} className="p-3 rounded space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold">Medication #{medIndex + 1}</span>
              <button
                type="button"
                onClick={() => onRemoveMedication(medIndex)}
                className="btn btn-xs btn-error text-white"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={med.medication}
                onChange={e => onMedicationChange(medIndex, 'medication', e.target.value)}
                placeholder="Medication"
                className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
              <input
                type="text"
                value={med.dosage}
                onChange={e => onMedicationChange(medIndex, 'dosage', e.target.value)}
                placeholder="Dosage"
                className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
              <input
                type="text"
                value={med.sinceWhen}
                onChange={e => onMedicationChange(medIndex, 'sinceWhen', e.target.value)}
                placeholder="Since when"
                className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
              <input
                type="text"
                value={med.reason}
                onChange={e => onMedicationChange(medIndex, 'reason', e.target.value)}
                placeholder="Reason"
                className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
            </div>

            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">File Attachments</span>
                <button
                  type="button"
                  onClick={() => onAddFile(medIndex)}
                  className="btn btn-xs btn-primary text-white"
                >
                  + Add File
                </button>
              </div>
              {med.fileUrl && med.fileUrl.length > 0 && (
                <div className="space-y-2">
                  {med.fileUrl.map((file, fileIndex) => (
                    <div key={fileIndex} className="flex flex-col gap-2 p-2 bg-gray-50 rounded">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={file.url}
                          onChange={e => onFileChange(medIndex, fileIndex, 'url', e.target.value)}
                          placeholder="Enter file URL"
                          className="p-2 rounded border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-primary flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => onRemoveFile(medIndex, fileIndex)}
                          className="btn btn-xs btn-error text-white"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        value={file.description || ''}
                        onChange={e => onFileChange(medIndex, fileIndex, 'description', e.target.value)}
                        placeholder="Description (optional)"
                        className="p-2 rounded border border-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}
