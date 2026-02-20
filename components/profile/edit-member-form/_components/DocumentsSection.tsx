import { MemberDocument } from '@/utils/types';

type DocumentsSectionProps = {
  documents: MemberDocument[];
  setDocuments: (val: MemberDocument[]) => void;
};

export function DocumentsSection({
  documents,
  setDocuments,
}: DocumentsSectionProps) {
  const handleAdd = () => {
    setDocuments([...documents, { url: '', description: '' }]);
  };

  const handleRemove = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleChangeUrl = (index: number, value: string) => {
    const updated = [...documents];
    updated[index] = { ...updated[index], url: value };
    setDocuments(updated);
  };

  const handleChangeDescription = (index: number, value: string) => {
    const updated = [...documents];
    updated[index] = { ...updated[index], description: value };
    setDocuments(updated);
  };

  return (
    <section>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">Documents</span>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-sm btn-primary text-white"
          >
            + Add Document URL
          </button>
        </div>
        <div className="space-y-3">
          {documents.length === 0 ? (
            <p className="text-gray-500 italic text-sm">No documents added yet</p>
          ) : (
            documents.map((doc, index) => (
              <div key={index} className="flex flex-col gap-2 p-3 border border-gray-200 rounded-lg">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={doc.description || ''}
                    onChange={e => handleChangeDescription(index, e.target.value)}
                    placeholder="Document description (optional)"
                    className="p-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="btn btn-sm btn-error text-white"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="url"
                  value={doc.url}
                  onChange={e => handleChangeUrl(index, e.target.value)}
                  placeholder="Enter document URL"
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
