import { FileWithDescription } from '@/utils/types';
import { getFileNameFromUrl } from '@/utils/common';
import { useTranslations } from 'next-intl';
import {
  getMemberFileDownloadUrl,
  deleteMemberFile,
  uploadMemberFile,
} from '@/utils/member-files-client';

const BLOOD_TYPE_OPTIONS: { value: BloodType; label: string }[] = [
  { value: 'A_POSITIVE', label: 'A+' },
  { value: 'A_NEGATIVE', label: 'A-' },
  { value: 'B_POSITIVE', label: 'B+' },
  { value: 'B_NEGATIVE', label: 'B-' },
  { value: 'AB_POSITIVE', label: 'AB+' },
  { value: 'AB_NEGATIVE', label: 'AB-' },
  { value: 'O_POSITIVE', label: 'O+' },
  { value: 'O_NEGATIVE', label: 'O-' },
];

type BloodType =
  | 'A_POSITIVE'
  | 'A_NEGATIVE'
  | 'B_POSITIVE'
  | 'B_NEGATIVE'
  | 'AB_POSITIVE'
  | 'AB_NEGATIVE'
  | 'O_POSITIVE'
  | 'O_NEGATIVE';

type BloodTypeSectionProps = {
  memberId: string;
  bloodType: string;
  setBloodType: (val: string) => void;
  bloodTypeFiles: FileWithDescription[];
  setBloodTypeFiles: (val: FileWithDescription[]) => void;
};

export function BloodTypeSection({
  memberId,
  bloodType,
  setBloodType,
  bloodTypeFiles,
  setBloodTypeFiles,
}: BloodTypeSectionProps) {
  const t = useTranslations('EditMemberForm.bloodType');
  const handleAddFile = () => {
    setBloodTypeFiles([...bloodTypeFiles, { url: '', description: '' }]);
  };

  const handleRemoveFile = async (index: number) => {
    const selectedFile = bloodTypeFiles[index];

    if (selectedFile?.url) {
      try {
        await deleteMemberFile({
          memberId,
          fileUrl: selectedFile.url,
          target: 'bloodTypeFiles',
        });
      } catch (error) {
        window.alert(
          error instanceof Error
            ? error.message
            : t('errors.failedRemoveBloodTypeFile'),
        );
        return;
      }
    }

    setBloodTypeFiles(bloodTypeFiles.filter((_, i) => i !== index));
  };

  const handleFileChange = (index: number, field: keyof FileWithDescription, value: string) => {
    const updated = [...bloodTypeFiles];
    updated[index] = { ...updated[index], [field]: value };
    setBloodTypeFiles(updated);
  };

  const handleUploadFile = async (index: number, file: File) => {
    try {
      const uploaded = await uploadMemberFile({
        memberId,
        target: 'bloodTypeFiles',
        file,
        folder: 'blood-type-files',
        description: bloodTypeFiles[index]?.description,
      });

      const updated = [...bloodTypeFiles];
      updated[index] = {
        ...updated[index],
        url: uploaded.file.url,
      };
      setBloodTypeFiles(updated);
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : t('errors.failedUploadFile'),
      );
    }
  };

  return (
    <div className="space-y-4">
      <section>
        <label className="flex flex-col gap-2">
          <span className="font-semibold text-gray-700">{t('label')}</span>
          <select
            value={bloodType}
            onChange={e => setBloodType(e.target.value)}
            className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full bg-white"
          >
            <option value="">{t('selectPlaceholder')}</option>
            {BLOOD_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">{t('filesTitle')}</span>
            <button
              type="button"
              onClick={handleAddFile}
              className="btn btn-sm btn-primary text-white"
            >
              {t('addFile')}
            </button>
          </div>
          <div className="space-y-2">
            {bloodTypeFiles.length === 0 ? (
              <p className="text-gray-500 italic text-sm">{t('emptyFiles')}</p>
            ) : (
              bloodTypeFiles.map((file, index) => (
                <div key={index} className="flex flex-col gap-2 p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-between gap-2">
                    {file.url ? (
                      <>
                        <p className="text-sm text-gray-800 font-medium truncate flex-1 min-w-0">
                          {getFileNameFromUrl(file.url)}
                        </p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <a
                            href={getMemberFileDownloadUrl(memberId, file.url)}
                            className="btn btn-sm btn-outline btn-primary"
                          >
                            {t('download')}
                          </a>
                          <button
                            type="button"
                            onClick={() => void handleRemoveFile(index)}
                            className="btn btn-sm btn-error text-white"
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
                            void handleUploadFile(index, selected);
                          }}
                          className="file-input file-input-bordered file-input-primary w-full"
                        />
                        <button
                          type="button"
                          onClick={() => void handleRemoveFile(index)}
                          className="btn btn-sm btn-error text-white"
                        >
                          {t('remove')}
                        </button>
                      </>
                    )}
                  </div>
                  <input
                    type="text"
                    value={file.description || ''}
                    onChange={e => handleFileChange(index, 'description', e.target.value)}
                    placeholder={t('descriptionPlaceholder')}
                    className="p-2 rounded border border-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
