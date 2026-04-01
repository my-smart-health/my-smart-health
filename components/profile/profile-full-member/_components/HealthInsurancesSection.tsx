'use client';

import { Shield, Phone } from 'lucide-react';
import { HealthInsurances } from '@/utils/types';
import { useTranslations } from 'next-intl';

type HealthInsurancesSectionProps = {
  healthInsurances: HealthInsurances[];
};

export function HealthInsurancesSection({ healthInsurances }: HealthInsurancesSectionProps) {
  const t = useTranslations('MemberProfileFull');
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-primary mb-3">{t('insurance.title')}</h3>
      <div className="space-y-3">
        {healthInsurances.map((insurance, index) => (
          <div key={index} className="p-4 border border-primary rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="text-primary mt-1 flex-shrink-0" size={24} />
              <div className="flex-1 space-y-2">
                {insurance.provider && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">{t('insurance.provider')}</p>
                    <p className="text-sm font-semibold text-gray-900">{insurance.provider}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {insurance.insuranceName && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase">{t('insurance.insuranceName')}</p>
                      <p className="text-sm text-gray-900">{insurance.insuranceName}</p>
                    </div>
                  )}
                  {insurance.insuranceNumber && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase">{t('insurance.insuranceNumber')}</p>
                      <p className="text-sm font-mono text-gray-900">{insurance.insuranceNumber}</p>
                    </div>
                  )}
                </div>
                {insurance.phone && (
                  <div className="flex items-center gap-2 pt-2 border-t border-blue-200">
                    <Phone size={14} className="text-blue-600" />
                    <a href={`tel:${insurance.phone}`} className="text-sm text-blue-600 hover:text-blue-800">
                      {insurance.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
