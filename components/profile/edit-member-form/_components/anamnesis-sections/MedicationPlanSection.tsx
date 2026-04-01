import { MedicationPlan, MedicationPlanTable, FileWithDescription } from '@/utils/types';
import { getFileNameFromUrl } from '@/utils/common';
import { useTranslations } from 'next-intl';
import {
  getMemberFileDownloadUrl,
  deleteMemberFile,
  uploadMemberFile,
} from '@/utils/member-files-client';

type MedicationPlanSectionProps = {
  memberId: string;
  anamnesisIndex: number;
  medicationPlan: MedicationPlan;
  onAddMedication: () => void;
  onRemoveMedication: (index: number) => Promise<void> | void;
  onMedicationChange: (index: number, field: keyof MedicationPlanTable, value: string) => void;
  onNoRegularMedicationsChange: (value: boolean | null) => void;
  onAddFile: (medIndex: number) => void;
  onRemoveFile: (medIndex: number, fileIndex: number) => void;
  onFileChange: (medIndex: number, fileIndex: number, field: keyof FileWithDescription, value: string) => void;
};

export function MedicationPlanSection({
  memberId,
  anamnesisIndex,
  medicationPlan,
  onAddMedication,
  onRemoveMedication,
  onMedicationChange,
  onNoRegularMedicationsChange,
  onAddFile,
  onRemoveFile,
  onFileChange,
}: MedicationPlanSectionProps) {
  const t = useTranslations('EditMemberForm.anamnesisSections.medicationPlan');

  const handleUploadFile = async (
    medIndex: number,
    fileIndex: number,
    file: File,
  ) => {
    try {
      const uploaded = await uploadMemberFile({
        memberId,
        target: 'anamnesesMedicationPlan',
        file,
        folder: 'anamneses/medicationplan',
        anamnesisIndex,
        medicationIndex: medIndex,
      });

      onFileChange(medIndex, fileIndex, 'url', uploaded.file.url);
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : t('errors.failedUploadFile'),
      );
    }
  };

  const handleRemoveFileWithApi = async (medIndex: number, fileIndex: number) => {
    const selectedMedication = medicationPlan.medicationPlanTable[medIndex];
    const selectedFile = selectedMedication.fileUrl?.[fileIndex];

    if (selectedFile?.url) {
      try {
        await deleteMemberFile({
          memberId,
          fileUrl: selectedFile.url,
          target: 'anamnesesMedicationPlan',
          anamnesisIndex,
          medicationIndex: medIndex,
        });
      } catch (error) {
        window.alert(
          error instanceof Error ? error.message : t('errors.failedRemoveFile'),
        );
        return;
      }
    }

    onRemoveFile(medIndex, fileIndex);
  };

  return (
    <details className="rounded border-2 border-primary p-3">
      <summary className="cursor-pointer font-semibold text-primary">{t('title')}</summary>
      <div className="mt-3 space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={medicationPlan.noRegularMedications === true}
            onChange={e => onNoRegularMedicationsChange(e.target.checked ? true : null)}
            className="checkbox checkbox-sm checkbox-primary"
          />
          {t('noRegularMedications')}
        </label>
        <button
          type="button"
          onClick={onAddMedication}
          className="btn btn-xs btn-primary text-white"
        >
          {t('addMedication')}
        </button>
        {medicationPlan.medicationPlanTable.map((med, medIndex) => (
          <div key={medIndex} className="p-3 rounded space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold">{t('medicationItem', { index: medIndex + 1 })}</span>
              <button
                type="button"
                onClick={() => void onRemoveMedication(medIndex)}
                className="btn btn-xs btn-error text-white"
              >
                {t('remove')}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={med.medication}
                onChange={e => onMedicationChange(medIndex, 'medication', e.target.value)}
                placeholder={t('medicationPlaceholder')}
                className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
              <input
                type="text"
                value={med.dosage}
                onChange={e => onMedicationChange(medIndex, 'dosage', e.target.value)}
                placeholder={t('dosagePlaceholder')}
                className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
              <input
                type="text"
                value={med.sinceWhen}
                onChange={e => onMedicationChange(medIndex, 'sinceWhen', e.target.value)}
                placeholder={t('sinceWhenPlaceholder')}
                className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
              <input
                type="text"
                value={med.reason}
                onChange={e => onMedicationChange(medIndex, 'reason', e.target.value)}
                placeholder={t('reasonPlaceholder')}
                className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
              />
            </div>

            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">{t('fileAttachments')}</span>
                <button
                  type="button"
                  onClick={() => onAddFile(medIndex)}
                  className="btn btn-xs btn-primary text-white"
                >
                  {t('addFile')}
                </button>
              </div>
              {med.fileUrl && med.fileUrl.length > 0 && (
                <div className="space-y-2">
                  {med.fileUrl.map((file, fileIndex) => (
                    <div key={fileIndex} className="flex flex-col gap-2 p-2 bg-gray-50 rounded">
                      <div className="flex items-center justify-between gap-2">
                        {file.url ? (
                          <>
                            <p className="text-xs text-gray-800 font-medium truncate flex-1 min-w-0">
                              {getFileNameFromUrl(file.url)}
                            </p>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <a
                                href={getMemberFileDownloadUrl(memberId, file.url)}
                                className="btn btn-xs btn-outline btn-primary"
                              >
                                {t('download')}
                              </a>
                              <button
                                type="button"
                                onClick={() => void handleRemoveFileWithApi(medIndex, fileIndex)}
                                className="btn btn-xs btn-error text-white"
                              >
                                {t('remove')}
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <input
                              type="file"
                              onChange={(event) => {
                                const selected = event.target.files?.[0];
                                if (!selected) {
                                  return;
                                }
                                void handleUploadFile(medIndex, fileIndex, selected);
                              }}
                              className="file-input file-input-bordered file-input-primary w-full"
                            />
                            <button
                              type="button"
                              onClick={() => void handleRemoveFileWithApi(medIndex, fileIndex)}
                              className="btn btn-xs btn-error text-white"
                            >
                              {t('remove')}
                            </button>
                          </>
                        )}
                      </div>
                      <input
                        type="text"
                        value={file.description || ''}
                        onChange={e => onFileChange(medIndex, fileIndex, 'description', e.target.value)}
                        placeholder={t('descriptionPlaceholder')}
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
