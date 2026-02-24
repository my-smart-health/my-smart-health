'use client';

import { MemberProfileDashboardProps } from '@/utils/types';
import Image from 'next/image';
import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  PersonalInfoSection,
  BloodTypeSection,
  AnamnesesSection,
  DocumentsSection,
  DoctorsSection,
  ContactsDisplay,
  SpecialNumbersSection,
} from '@/components/profile/profile-full-member/_components';

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
          My Profile
        </div>
        <span className="absolute top-3 right-3">
          <Info className="text-primary" size={40} />
        </span>
      </div>

      <div className="collapse-content">
        <div role="tablist" className="tabs tabs-lifted tabs-lg w-full">

          {hasPersonalInfo && (
            <>
              <input type="radio" name="member_home_tabs" role="tab" className="tab" aria-label="My Profile" defaultChecked />
              <div role="tabpanel" className="tab-content rounded-box p-6">
                <PersonalInfoSection
                  birthday={member.birthday}
                  heightCm={member.heightCm}
                  weightKg={member.weightKg}
                  healthInsurances={member.healthInsurances}
                  familyMembers={member.familyMembers}
                />
              </div>
            </>
          )}

          {hasBloodType && (
            <>
              <input type="radio" name="member_home_tabs" role="tab" className="tab" aria-label="Blood Type" />
              <div role="tabpanel" className="tab-content rounded-box p-6">
                <BloodTypeSection
                  bloodType={member.bloodType}
                  bloodTypeFiles={member.bloodTypeFiles}
                />
              </div>
            </>
          )}

          {hasAnamneses && (
            <>
              <input type="radio" name="member_home_tabs" role="tab" className="tab" aria-label="Anamneses" />
              <div role="tabpanel" className="tab-content rounded-box p-6">
                <AnamnesesSection anamneses={member.anamneses} />
              </div>
            </>
          )}

          {hasDocuments && (
            <>
              <input type="radio" name="member_home_tabs" role="tab" className="tab" aria-label="Documents" />
              <div role="tabpanel" className="tab-content rounded-box p-6">
                <DocumentsSection documents={member.documents} />
              </div>
            </>
          )}

          {hasDoctors && (
            <>
              <input type="radio" name="member_home_tabs" role="tab" className="tab" aria-label="My Doctors" />
              <div role="tabpanel" className="tab-content rounded-box p-6">
                <DoctorsSection doctors={member.doctors} />
              </div>
            </>
          )}
          {hasContacts && (
            <>
              <input type="radio" name="member_home_tabs" role="tab" className="tab" aria-label="Contacts" />
              <div role="tabpanel" className="tab-content rounded-box p-6">
                <ContactsDisplay contacts={contacts} />
              </div>
            </>
          )}

          {hasSpecialNumbers && (
            <>
              <input type="radio" name="member_home_tabs" role="tab" className="tab" aria-label="Special Numbers" />
              <div role="tabpanel" className="tab-content rounded-box p-6">
                <SpecialNumbersSection specialNumbers={member.telMedicineNumbers} />
              </div>
            </>
          )}


        </div>
      </div>
    </div>
  );
}
