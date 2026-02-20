import { FileText, ExternalLink } from 'lucide-react';
import { MemberDocument } from '@/utils/types';

type DocumentsSectionProps = {
  documents: MemberDocument[];
};

export function DocumentsSection({ documents }: DocumentsSectionProps) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-primary mb-3">Documents</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {documents.map((doc, index) => {
          const displayTitle = doc.description && doc.description.trim() !== ''
            ? doc.description
            : `Document ${index + 1}`;

          return (
            <a
              key={index}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-primary transition-colors group"
            >
              <FileText className="text-gray-600 group-hover:text-primary flex-shrink-0" size={20} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate font-medium">{displayTitle}</p>
                <p className="text-xs text-gray-500 truncate">{doc.url}</p>
              </div>
              <ExternalLink className="text-gray-400 group-hover:text-primary flex-shrink-0" size={16} />
            </a>
          );
        })}
      </div>
    </div>
  );
}
