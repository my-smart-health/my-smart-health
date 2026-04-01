'use client';

import { MemberProfileDashboardProps } from '@/utils/types';
import Image from 'next/image';
import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import ProfileFullMember from '../profile/profile-full-member/ProfileFullMember';

type ContactDoctor = {
  id: string;
  name: string | null;
  profileImages: string[] | null;
  fieldOfExpertise: Array<{ name: string }> | null;
  displayEmail: string | null;
  phones: string[];
};

type MemberDashboardProps = {
  member: MemberProfileDashboardProps;
};

export default function MemberDashboard({ member }: MemberDashboardProps) {
  const t = useTranslations('MemberDashboard');
  const [contacts, setContacts] = useState<ContactDoctor[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!member?.id) return;

      try {
        const response = await fetch(`/api/member/contacts?memberId=${member.id}`);
        if (response.ok) {
          const data = await response.json();
          setContacts(data);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    if (member?.id) {
      fetchContacts();
    }
  }, [member?.id]);

  if (!member) return null;

  const hasPersonalInfo = member.birthday || member.heightCm || member.weightKg ||
    (member.healthInsurances && member.healthInsurances.length > 0) ||
    (member.familyMembers && member.familyMembers.length > 0);
  const hasBloodType = member.bloodType || (member.bloodTypeFiles && member.bloodTypeFiles.length > 0);
  const hasAnamneses = member.anamneses && member.anamneses.length > 0;
  const hasDocuments = member.documents && member.documents.length > 0;
  const hasDoctors = member.doctors && member.doctors.length > 0;
  const hasContacts = contacts && contacts.length > 0;
  const hasSpecialNumbers = member.isActive && member.telMedicineNumbers && member.telMedicineNumbers.length > 0;

  if (!hasPersonalInfo && !hasBloodType &&
    !hasAnamneses && !hasDocuments && !hasDoctors && !hasContacts && !hasSpecialNumbers) {
    return null;
  }

  return (
    <div className="collapse shadow-xl border-2 border-primary rounded-2xl mb-1">
      <input type="checkbox" className="w-full h-full" />
      <div className="collapse-title flex items-center gap-3 w-full h-full font-bold text-xl">
        <div className='flex items-center mx-auto'>
          <Image
            src="/logo.png"
            alt="My Smart Health"
            width={150}
            height={60}
            loading="lazy"
            placeholder="empty"
            style={{ objectFit: 'contain', width: 'auto', height: 'auto' }}
            className="mx-auto"
          />
          {t('myProfile')}
        </div>
        <span className="absolute top-3 right-3">
          <Info className="text-primary" size={40} />
        </span>
      </div>

      <div className="collapse-content">
        <ProfileFullMember member={member} />
      </div>

    </div>
  );
}
