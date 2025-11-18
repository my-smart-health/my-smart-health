import Link from 'next/link';
import { FileText } from 'lucide-react';

import Divider from '@/components/divider/Divider';

type UploadedFilesSectionProps = {
  profileFiles: string[];
  heading?: string | null;
  hideDivider?: boolean;
  showUrl?: boolean;
  className?: string;
};

const getFileNameFromUrl = (fileUrl: string) => {
  try {
    const url = new URL(fileUrl);
    url.searchParams.delete('download');
    const parts = url.pathname.split('/');
    return decodeURIComponent(parts.pop() || fileUrl);
  } catch {
    const stripped = fileUrl.split(/[?#]/)[0];
    return stripped.replace(/^.*[\\/]/, '') || fileUrl;
  }
};

export default function UploadedFilesSection({
  profileFiles,
  heading = 'Documents & Files',
  hideDivider = false,
  showUrl = false,
  className = '',
}: UploadedFilesSectionProps) {
  if (!Array.isArray(profileFiles) || profileFiles.length === 0) {
    return null;
  }

  const sectionClassName = ['w-full', className].filter(Boolean).join(' ');
  const getDownloadUrl = (fileUrl: string) => {
    try {
      const url = new URL(fileUrl);
      url.searchParams.set('download', '1');
      return url.toString();
    } catch {
      const hasQuery = fileUrl.includes('?');
      return fileUrl + (hasQuery ? '&' : '?') + 'download=1';
    }
  };

  return (
    <section className={sectionClassName}>
      {!hideDivider && <Divider addClass="my-4" />}
      {heading && (
        <h3 className="text-lg font-semibold text-primary mb-3">{heading}</h3>
      )}
      <div className="flex flex-wrap gap-3">
        {profileFiles.map((fileUrl) => {
          const fileName = getFileNameFromUrl(fileUrl);
          return (
            <article key={fileUrl} className="w-full sm:w-auto">
              <Link
                href={getDownloadUrl(fileUrl)}
                prefetch={false}
                download
                className="badge badge-primary p-4 text-white w-full sm:w-auto hover:bg-primary/75 transition-colors duration-200 break-all text-left flex items-center gap-2"
              >
                <FileText size={18} />
                <span className="break-all whitespace-normal">{fileName}</span>
              </Link>
              {showUrl && (
                <p className="mt-2 text-xs text-gray-500 break-all">{fileUrl}</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}