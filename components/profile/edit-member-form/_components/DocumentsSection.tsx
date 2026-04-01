import { MemberDocument } from '@/utils/types';
import { getFileNameFromUrl } from '@/utils/common';
import { useTranslations } from 'next-intl';
import {
  getMemberFileDownloadUrl,
  deleteMemberFile,
  uploadMemberFile,
} from '@/utils/member-files-client';

type DocumentsSectionProps = {
  memberId: string;
  documents: MemberDocument[];
  setDocuments: (val: MemberDocument[]) => void;
};

export function DocumentsSection({
  memberId,
  documents,
  setDocuments,
}: DocumentsSectionProps) {
  const t = useTranslations('EditMemberForm.documents');
  const handleAdd = () => {
    setDocuments([...documents, { url: '', description: '' }]);
  };

  const handleRemove = async (index: number) => {
    const selectedDocument = documents[index];

    if (selectedDocument?.url) {
      try {
        await deleteMemberFile({
          memberId,
          fileUrl: selectedDocument.url,
          target: 'documents',
        });
      } catch (error) {
        window.alert(
          error instanceof Error
            ? error.message
            : t('errors.failedRemoveDocument'),
        );
        return;
      }
    }

    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleChangeDescription = (index: number, value: string) => {
    const updated = [...documents];
    updated[index] = { ...updated[index], description: value };
    setDocuments(updated);
  };

  const handleUpload = async (index: number, file: File) => {
    try {
      const uploaded = await uploadMemberFile({
        memberId,
        target: 'documents',
        file,
        folder: 'documents',
        description: documents[index]?.description,
      });

      const updated = [...documents];
      updated[index] = {
        ...updated[index],
        url: uploaded.file.url,
      };
      setDocuments(updated);
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : t('errors.failedUploadDocument'),
      );
    }
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
            {t('addDocument')}
          </button>
        </div>
        <div className="space-y-3">
          {documents.length === 0 ? (
            <p className="text-gray-500 italic text-sm">{t('empty')}</p>
          ) : (
            documents.map((doc, index) => (
              <div key={index} className="flex flex-col gap-2 p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between gap-2">
                  {doc.url ? (
                    <>
                      <p className="text-sm text-gray-800 font-medium truncate flex-1 min-w-0">
                        {getFileNameFromUrl(doc.url)}
                      </p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <a
                          href={getMemberFileDownloadUrl(memberId, doc.url)}
                          className="btn btn-sm btn-outline btn-primary"
                        >
                          {t('download')}
                        </a>
                        <button
                          type="button"
                          onClick={() => void handleRemove(index)}
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
                          void handleUpload(index, selected);
                        }}
                        className="file-input file-input-bordered file-input-primary w-full"
                      />
                      <button
                        type="button"
                        onClick={() => void handleRemove(index)}
                        className="btn btn-sm btn-error text-white"
                      >
                        {t('remove')}
                      </button>
                    </>
                  )}
                </div>
                <input
                  type="text"
                  value={doc.description || ''}
                  onChange={e => handleChangeDescription(index, e.target.value)}
                  placeholder={t('descriptionPlaceholder')}
                  className="p-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary flex-1"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
