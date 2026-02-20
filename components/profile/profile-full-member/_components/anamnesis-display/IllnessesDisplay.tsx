import { Stethoscope } from 'lucide-react';
import { Illnesses } from '@/utils/types';

type IllnessesDisplayProps = {
  illnesses: Illnesses;
};

const illnessLabels: Record<keyof Omit<Illnesses, 'other'>, string> = {
  highBloodPressure: 'High Blood Pressure',
  diabetes: 'Diabetes',
  heartDisease: 'Heart Disease',
  stroke: 'Stroke',
  asthma: 'Asthma',
  allergies: 'Allergies',
  thyroidDisorders: 'Thyroid Disorders',
  gastrointestinalDiseases: 'Gastrointestinal Diseases',
  liverDisorders: 'Liver Disorders',
  kidneyDiseases: 'Kidney Diseases',
  rheumatism: 'Rheumatism',
  autoimmuneDiseases: 'Autoimmune Diseases',
  cancer: 'Cancer',
  mentalHealthDisorders: 'Mental Health Disorders',
  infectiousDiseases: 'Infectious Diseases',
};

export function IllnessesDisplay({ illnesses }: IllnessesDisplayProps) {
  const checkedIllnesses = Object.entries(illnesses)
    .filter(([key, value]) => key !== 'other' && value === true)
    .map(([key]) => illnessLabels[key as keyof typeof illnessLabels]);

  const hasOther = illnesses.other && illnesses.other.trim() !== '';
  const hasAnyIllness = checkedIllnesses.length > 0 || hasOther;

  if (!hasAnyIllness) {
    return null;
  }

  return (
    <div className="mb-4 p-3 rounded border border-primary">
      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <Stethoscope className="text-primary" size={16} />
        Medical Conditions
      </h4>
      <ul className="space-y-1">
        {checkedIllnesses.map((illness, index) => (
          <li key={index} className={`flex items-center gap-2 ${index < checkedIllnesses.length - 1 ? 'border-b border-primary pb-1' : ''}`}>
            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
            {illness}
          </li>
        ))}
        {hasOther && (
          <li key="other" className="flex items-center gap-2 border-t border-primary pt-1">
            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
            Other: {illnesses.other}
          </li>
        )}
      </ul>
    </div>
  );
}
