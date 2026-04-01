'use client';

import { Pill } from 'lucide-react';
import { MedicationPlan } from '@/utils/types';
import { FileAttachmentsList } from '../FileAttachmentsList';
import { Fragment } from 'react';
import { useTranslations } from 'next-intl';

type MedicationPlanDisplayProps = {
  memberId: string;
  medicationPlan: MedicationPlan;
};

export function MedicationPlanDisplay({
  memberId,
  medicationPlan,
}: MedicationPlanDisplayProps) {
  const t = useTranslations('MemberProfileFull');
  const hasMedications = medicationPlan.medicationPlanTable && medicationPlan.medicationPlanTable.length > 0;

  if (!hasMedications && !medicationPlan.noRegularMedications) {
    return null;
  }

  return (
    <div className="mb-4 p-3 rounded border border-primary">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Pill className="text-primary" size={16} />
        {t('anamnesisDisplay.medicationPlan.title')}
      </h4>

      {medicationPlan.noRegularMedications && (
        <p className="text text-green-500 mb-3">{t('anamnesisDisplay.medicationPlan.noRegularMedications')}</p>
      )}

      {hasMedications && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-primary">
                <th className="text-left py-2 px-3 font-semibold text-gray-700 border-r border-primary">{t('anamnesisDisplay.medicationPlan.medication')}</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700 border-r border-primary">{t('anamnesisDisplay.medicationPlan.dosage')}</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700 border-r border-primary">{t('anamnesisDisplay.medicationPlan.sinceWhen')}</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700">{t('anamnesisDisplay.medicationPlan.reason')}</th>
              </tr>
            </thead>
            <tbody>
              {medicationPlan.medicationPlanTable.map((med, index) => (
                <Fragment key={index}>
                  <tr className="border-b border-primary">
                    <td className="py-2 px-3 text-gray-900 font-medium border-r border-primary">{med.medication}</td>
                    <td className="py-2 px-3 text-gray-900 border-r border-primary">{med.dosage}</td>
                    <td className="py-2 px-3 text-gray-900 border-r border-primary">{med.sinceWhen}</td>
                    <td className="py-2 px-3 text-gray-900">{med.reason || '-'}</td>
                  </tr>
                  {med.fileUrl && med.fileUrl.length > 0 && (
                    <tr className="border-b border-primary">
                      <td colSpan={4} className="py-2 px-3">
                        <div className="text-xs font-semibold text-gray-600 mb-1">{t('anamnesisDisplay.medicationPlan.attachments')}</div>
                        <FileAttachmentsList
                          memberId={memberId}
                          files={med.fileUrl}
                          title=""
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
