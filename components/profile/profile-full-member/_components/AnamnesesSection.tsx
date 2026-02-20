import { FileText } from 'lucide-react';
import { Anamneses } from '@/utils/types';
import {
  IllnessesDisplay,
  HospitalStaysDisplay,
  MedicationPlanDisplay,
  AllergiesIntolerancesDisplay,
  FamilyHistoryDisplay,
  LifestyleDisplay,
  VaccinationStatusDisplay,
} from './anamnesis-display';

type AnamnesesSectionProps = {
  anamneses: Anamneses[];
};

export function AnamnesesSection({ anamneses }: AnamnesesSectionProps) {
  if (!anamneses || anamneses.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-primary mb-3">Medical History (Anamneses)</h3>
      <div className="space-y-6">
        {anamneses.map((anamnesis, index) => (
          <div key={index} className="p-4 rounded-lg">
            {anamnesis.text && (
              <div className="flex items-start gap-3 mb-4">
                <FileText className="text-primary mt-1 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{anamnesis.text}</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <IllnessesDisplay illnesses={anamnesis.illnesses} />

              <HospitalStaysDisplay hospitalStays={anamnesis.hospitalStays} />

              <MedicationPlanDisplay medicationPlan={anamnesis.medicationPlan} />

              <AllergiesIntolerancesDisplay allergiesIntolerances={anamnesis.allergiesIntolerances} />

              <FamilyHistoryDisplay familyHistory={anamnesis.familyHistoryOfIllnesses} />

              <LifestyleDisplay lifestyle={anamnesis.lifestyle} />

              <VaccinationStatusDisplay vaccinationStatus={anamnesis.vaccinationStatus} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

