'use client';

import Link from 'next/link';
import { MonitorSmartphone, PhoneCall, BadgeInfo } from 'lucide-react';
import { TelMedicinePhoneNumber } from '@/utils/types';
import { useTranslations } from 'next-intl';

type SpecialNumbersSectionProps = {
  specialNumbers: TelMedicinePhoneNumber[];
};

export function SpecialNumbersSection({
  specialNumbers,
}: SpecialNumbersSectionProps) {
  const t = useTranslations('MemberProfileFull');
  if (!specialNumbers || specialNumbers.length === 0) return null;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
        <MonitorSmartphone size={18} className="text-primary" />
        {t('special.title')}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {specialNumbers.map((item, index) => (
          <div key={index} className="p-4 border border-primary rounded-lg">
            <div className="flex items-start gap-2">
              <PhoneCall size={18} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500 uppercase">{item.type || t('special.specialNumber')}</p>
                <Link
                  href={`tel:${item.phone}`}
                  className="text-sm font-semibold text-primary hover:text-primary/75 transition-colors break-all"
                >
                  {item.phone}
                </Link>

                {item.description && item.description.trim().length > 0 && (
                  <p className="text-xs text-gray-600 mt-2 flex items-start gap-1">
                    <BadgeInfo size={12} className="mt-0.5 flex-shrink-0" />
                    <span>{item.description}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
