import { Droplet, FileText, ExternalLink } from 'lucide-react';
import { $Enums } from '@prisma/client';
import { FileWithDescription } from '@/utils/types';

type BloodTypeSectionProps = {
  bloodType: $Enums.BloodType | null;
  bloodTypeFiles: FileWithDescription[];
};

const BLOOD_TYPE_DISPLAY: Record<$Enums.BloodType, string> = {
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  AB_POSITIVE: 'AB+',
  AB_NEGATIVE: 'AB-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-',
};

export function BloodTypeSection({ bloodType, bloodTypeFiles }: BloodTypeSectionProps) {
  const hasFiles = bloodTypeFiles && bloodTypeFiles.length > 0;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-primary mb-3">Blood Type</h3>
      <div className="space-y-3">
        {bloodType && (
          <div className="flex items-center gap-3 p-4 rounded-lg border border-red-600">
            <Droplet className="text-red-600 flex-shrink-0" size={24} />
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Blood Type</p>
              <p className="text-xl font-bold text-red-600">{BLOOD_TYPE_DISPLAY[bloodType]}</p>
            </div>
          </div>
        )}
        {hasFiles && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText size={16} />
              Related Documents
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {bloodTypeFiles.map((file, index) => {
                const displayTitle = file.description && file.description.trim() !== ''
                  ? file.description
                  : `Document ${index + 1}`;
                return (
                  <a
                    key={index}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-primary transition-colors group"
                  >
                    <FileText className="text-gray-600 group-hover:text-primary flex-shrink-0" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{displayTitle}</p>
                      <p className="text-xs text-gray-500 truncate">{file.url}</p>
                    </div>
                    <ExternalLink className="text-gray-400 group-hover:text-primary flex-shrink-0" size={16} />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
