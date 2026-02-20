import { FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { MemberDocument, FileWithDescription } from '@/utils/types';

type FileAttachmentsListProps = {
  files: string[] | MemberDocument[] | FileWithDescription[];
  title?: string;
};

export function FileAttachmentsList({ files, title = 'Attachments' }: FileAttachmentsListProps) {
  const hasTitle = title.trim().length > 0;

  const validFiles = files.filter(file => {
    if (typeof file === 'string') {
      return file?.trim();
    }
    return file?.url?.trim();
  });

  if (validFiles.length === 0) {
    return null;
  }

  return (
    <div>
      {hasTitle && (
        <p className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
          <FileText size={14} />
          {title}
        </p>
      )}
      <div className="grid grid-cols-1 gap-2">
        {validFiles.map((file, fileIndex) => {
          const isStringFormat = typeof file === 'string';
          const url = isStringFormat ? file : file.url;
          const description = isStringFormat ? null : file.description;
          const displayTitle = description && description.trim() !== ''
            ? description
            : `Document ${fileIndex + 1}`;

          return (
            <Link
              key={fileIndex}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 rounded-lg border border-primary hover:bg-primary/10 hover:border-primary transition-colors group"
            >
              <FileText className="text-gray-600 group-hover:text-primary flex-shrink-0" size={18} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-900 truncate font-medium">{displayTitle}</p>
                <p className="text-[10px] text-gray-500 truncate">{url}</p>
              </div>
              <ExternalLink className="text-gray-400 group-hover:text-primary flex-shrink-0" size={14} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
