import { FileWithDescription } from '@/utils/types';

type FileAttachmentsSectionProps = {
  fileUrl?: FileWithDescription[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof FileWithDescription, value: string) => void;
};

export function FileAttachmentsSection({
  fileUrl,
  onAdd,
  onRemove,
  onChange,
}: FileAttachmentsSectionProps) {
  return (
    <details className="rounded border-2 border-primary p-3">
      <summary className="cursor-pointer font-semibold text-primary">File Attachments</summary>
      <div className="mt-3 space-y-2">
        <button
          type="button"
          onClick={onAdd}
          className="btn btn-xs btn-primary text-white"
        >
          + Add File URL
        </button>
        {fileUrl && fileUrl.length > 0 && (
          <div className="space-y-2">
            {fileUrl.map((file, fileIndex) => (
              <div key={fileIndex} className="flex flex-col gap-2 p-2 bg-gray-50 rounded">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={file.url}
                    onChange={e => onChange(fileIndex, 'url', e.target.value)}
                    placeholder="File URL"
                    className="p-2 rounded border border-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary flex-1"
                  />
                </div>
                <input
                  type="text"
                  value={file.description || ''}
                  onChange={e => onChange(fileIndex, 'description', e.target.value)}
                  placeholder="Description (optional)"
                  className="p-2 rounded border border-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => onRemove(fileIndex)}
                  className="btn btn-xs btn-error text-white sm:w-auto w-full"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </details>
  );
}
