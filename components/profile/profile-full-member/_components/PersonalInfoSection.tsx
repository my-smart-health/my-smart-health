import { Calendar, Ruler, Weight, Users, Phone as PhoneIcon, Activity } from 'lucide-react';
import { HealthInsurances, FamilyMember } from '@/utils/types';
import { HealthInsurancesSection } from './HealthInsurancesSection';
import Link from 'next/link';

type PersonalInfoSectionProps = {
  birthday: string | null;
  heightCm: number | null;
  weightKg: number | null;
  healthInsurances?: HealthInsurances[];
  familyMembers?: FamilyMember[];
};

export function PersonalInfoSection({
  birthday,
  heightCm,
  weightKg,
  healthInsurances,
  familyMembers,
}: PersonalInfoSectionProps) {
  const formatBirthday = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const calculateAge = (dateString: string | null) => {
    if (!dateString) return null;
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = (heightCm: number | null, weightKg: number | null) => {
    if (!heightCm || !weightKg) return null;
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi: string | null) => {
    if (!bmi) return null;
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { text: 'Underweight', color: 'text-blue-600' };
    if (bmiValue < 25) return { text: 'Normal weight', color: 'text-green-600' };
    if (bmiValue < 30) return { text: 'Overweight', color: 'text-orange-600' };
    return { text: 'Obese', color: 'text-red-600' };
  };

  const formattedBirthday = formatBirthday(birthday);
  const age = calculateAge(birthday);
  const bmi = calculateBMI(heightCm, weightKg);
  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-primary mb-3">Personal Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {birthday && (
          <div className="flex items-start gap-2 p-3">
            <Calendar className="text-primary mt-1 flex-shrink-0" size={20} />
            <div>
              <p className="text-xs text-gray-500 uppercase">Birthday</p>
              <p className="text-sm font-medium">{formattedBirthday}</p>
              {age !== null && <p className="text-xs text-gray-600">({age} years old)</p>}
            </div>
          </div>
        )}
        {heightCm && (
          <div className="flex items-start gap-2 p-3">
            <Ruler className="text-primary mt-1 flex-shrink-0" size={20} />
            <div>
              <p className="text-xs text-gray-500 uppercase">Height</p>
              <p className="text-sm font-medium">{heightCm} cm</p>
            </div>
          </div>
        )}
        {weightKg && (
          <div className="flex items-start gap-2 p-3">
            <Weight className="text-primary mt-1 flex-shrink-0" size={20} />
            <div>
              <p className="text-xs text-gray-500 uppercase">Weight</p>
              <p className="text-sm font-medium">{weightKg} kg</p>
            </div>
          </div>
        )}
      </div>

      {bmi && (
        <div className="mt-6 px-4">
          <div className="flex items-start gap-3">
            <Activity className="text-primary mt-1 flex-shrink-0" size={20} />
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Body Mass Index (BMI)</p>
              <p className="text-2xl font-bold text-gray-900">{bmi}</p>
              {bmiCategory && (
                <p className={`text-sm font-medium mt-1 ${bmiCategory.color}`}>
                  {bmiCategory.text}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {healthInsurances && healthInsurances.length > 0 && (
        <div className="mt-6">
          <HealthInsurancesSection healthInsurances={healthInsurances} />
        </div>
      )}

      {familyMembers && familyMembers.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-primary mb-3">Family Members</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {familyMembers.map((member, index) => (
              <div key={index} className="p-4 border border-primary rounded-lg">
                <div className="flex items-start gap-3">
                  <Users className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    {member.phones && member.phones.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {member.phones.map((phone, phoneIndex) => (
                          <Link
                            key={phoneIndex}
                            href={`tel:${phone}`}
                            className="flex items-center gap-1 text-sm text-primary hover:text-primary/75 transition-colors"
                          >
                            <PhoneIcon size={14} />
                            <span>{phone}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
