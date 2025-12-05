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
      {!hideDivider && <Divider addClass="my-1" />}
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
                className="btn btn-primary gap-2 sm:gap-3 rounded-xl py-2 text-white w-full h-fit sm:w-auto hover:bg-primary/75 transition-colors duration-200 break-all text-left"
              >
                <FileText size={30} className='sm:size-[30px] flex-shrink-0' />
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