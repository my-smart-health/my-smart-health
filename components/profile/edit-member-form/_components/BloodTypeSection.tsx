import { $Enums } from '@prisma/client';
import { FileWithDescription } from '@/utils/types';
import { getFileNameFromUrl } from '@/utils/common';
import {
  getMemberFileDownloadUrl,
  deleteMemberFile,
  uploadMemberFile,
} from '@/utils/member-files-client';

const BLOOD_TYPE_OPTIONS: { value: $Enums.BloodType; label: string }[] = [
  { value: $Enums.BloodType.A_POSITIVE, label: 'A+' },
  { value: $Enums.BloodType.A_NEGATIVE, label: 'A-' },
  { value: $Enums.BloodType.B_POSITIVE, label: 'B+' },
  { value: $Enums.BloodType.B_NEGATIVE, label: 'B-' },
  { value: $Enums.BloodType.AB_POSITIVE, label: 'AB+' },
  { value: $Enums.BloodType.AB_NEGATIVE, label: 'AB-' },
  { value: $Enums.BloodType.O_POSITIVE, label: 'O+' },
  { value: $Enums.BloodType.O_NEGATIVE, label: 'O-' },
];

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
            : 'Failed to remove blood type file',
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
        error instanceof Error ? error.message : 'Failed to upload file',
      );
    }
  };

  return (
    <div className="space-y-4">
      <section>
        <label className="flex flex-col gap-2">
          <span className="font-semibold text-gray-700">Blood Type (Optional)</span>
          <select
            value={bloodType}
            onChange={e => setBloodType(e.target.value)}
            className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full bg-white"
          >
            <option value="">Select blood type...</option>
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
            <span className="font-semibold text-gray-700">Blood Type Files</span>
            <button
              type="button"
              onClick={handleAddFile}
              className="btn btn-sm btn-primary text-white"
            >
              + Add File
            </button>
          </div>
          <div className="space-y-2">
            {bloodTypeFiles.length === 0 ? (
              <p className="text-gray-500 italic text-sm">No files added yet</p>
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
                            Download
                          </a>
                          <button
                            type="button"
                            onClick={() => void handleRemoveFile(index)}
                            className="btn btn-sm btn-error text-white"
                          >
                            Remove
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
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                  <input
                    type="text"
                    value={file.description || ''}
                    onChange={e => handleFileChange(index, 'description', e.target.value)}
                    placeholder="Description (optional)"
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
