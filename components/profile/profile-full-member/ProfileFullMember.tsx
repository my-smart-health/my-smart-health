'use client';

import { useEffect, useState } from "react";

import {
  PersonalInfoSection,
  BloodTypeSection,
  AnamnesesSection,
  DoctorsSection,
  DocumentsSection,
  AdminOnlySection,
  ContactsDisplay,
} from "./_components";
import Divider from "@/components/divider/Divider";
import GoBack from "@/components/buttons/go-back/GoBack";
import { MemberProfileDashboardProps } from "@/utils/types";

type ContactDoctor = {
  id: string;
  name: string | null;
  profileImages: string[] | null;
  fieldOfExpertise: Array<{ name: string }> | null;
  displayEmail: string | null;
  phones: string[];
};

export default function ProfileFullMember({
  member,
  isAdmin = false,
}: {
  member: MemberProfileDashboardProps | null;
  isAdmin?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [contacts, setContacts] = useState<ContactDoctor[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!member?.id) return;

      try {
        setIsLoadingContacts(true);
        const response = await fetch(`/api/member/contacts?memberId=${member.id}`);
        if (response.ok) {
          const data = await response.json();
          setContacts(data);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setIsLoadingContacts(false);
      }
    };

    if (mounted && member?.id) {
      fetchContacts();
    }
  }, [mounted, member?.id]);

  if (!mounted) return null;

  if (!member) {
    return (
      <div className="flex flex-col gap-4 p-4 w-full">
        <p className="text-red-500 text-center">Member profile not found</p>
      </div>
    );
  }

  const {
    name,
    email,
    birthday,
    heightCm,
    weightKg,
    bloodType,
    bloodTypeFiles,
    healthInsurances,

    anamneses,
    doctors,
    documents,
    familyMembers,
    isActive,
    activeUntil,
    createdAt,
    updatedAt,
  } = member;

  const hasPersonalInfo = birthday || heightCm || weightKg || (healthInsurances && healthInsurances.length > 0) || (familyMembers && familyMembers.length > 0);
  const hasBloodType = bloodType || (bloodTypeFiles && bloodTypeFiles.length > 0);
  const hasAnamneses = anamneses && anamneses.length > 0;
  const hasDoctors = doctors && doctors.length > 0;
  const hasDocuments = documents && documents.length > 0;
  const hasContacts = contacts && contacts.length > 0;
  const hasAdminInfo = isAdmin;

  const firstTab = hasAdminInfo
    ? 'admin'
    : hasPersonalInfo
      ? 'personal'
      : hasAnamneses
        ? 'anamneses'
        : hasBloodType
          ? 'blood'
          : hasDoctors
            ? 'doctors'
            : hasDocuments
              ? 'documents'
              : hasContacts
                ? 'contacts'
                : null;

  return (
    <div className="flex flex-col gap-1 p-2 sm:p-3 w-full max-w-full overflow-hidden">
      <section className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center w-full gap-2">
          <h2 className="font-bold self-end text-primary text-xl break-words">
            {name || "Member Profile"}
          </h2>
          <GoBack />
        </div>
      </section>

      {(hasAdminInfo || hasPersonalInfo || hasAnamneses || hasBloodType || hasDoctors || hasDocuments || hasContacts) && (
        <>
          <Divider addClass="my-1" />
          <div role="tablist" className="tabs tabs-lifted tabs-lg w-full">
            {hasAdminInfo && (
              <>
                <input
                  type="radio"
                  name="member_profile_tabs"
                  role="tab"
                  className="tab"
                  aria-label="Admin"
                  defaultChecked={firstTab === 'admin'}
                />
                <div role="tabpanel" className="tab-content rounded-box p-4 sm:p-6">
                  <AdminOnlySection
                    email={email}
                    isActive={isActive}
                    activeUntil={activeUntil}
                    createdAt={createdAt}
                    updatedAt={updatedAt}
                  />
                </div>
              </>
            )}

            {hasPersonalInfo && (
              <>
                <input
                  type="radio"
                  name="member_profile_tabs"
                  role="tab"
                  className="tab"
                  aria-label="Personal Info"
                  defaultChecked={firstTab === 'personal'}
                />
                <div role="tabpanel" className="tab-content rounded-box p-4 sm:p-6">
                  <PersonalInfoSection
                    birthday={birthday}
                    heightCm={heightCm}
                    weightKg={weightKg}
                    healthInsurances={healthInsurances}
                    familyMembers={familyMembers}
                  />
                </div>
              </>
            )}

            {hasAnamneses && (
              <>
                <input
                  type="radio"
                  name="member_profile_tabs"
                  role="tab"
                  className="tab"
                  aria-label="Anamneses"
                  defaultChecked={firstTab === 'anamneses'}
                />
                <div role="tabpanel" className="tab-content rounded-box p-4 sm:p-6">
                  <AnamnesesSection anamneses={anamneses} />
                </div>
              </>
            )}

            {hasBloodType && (
              <>
                <input
                  type="radio"
                  name="member_profile_tabs"
                  role="tab"
                  className="tab"
                  aria-label="Blood Type"
                  defaultChecked={firstTab === 'blood'}
                />
                <div role="tabpanel" className="tab-content rounded-box p-4 sm:p-6">
                  <BloodTypeSection bloodType={bloodType} bloodTypeFiles={bloodTypeFiles} />
                </div>
              </>
            )}

            {hasDoctors && (
              <>
                <input
                  type="radio"
                  name="member_profile_tabs"
                  role="tab"
                  className="tab"
                  aria-label="Doctors"
                  defaultChecked={firstTab === 'doctors'}
                />
                <div role="tabpanel" className="tab-content rounded-box p-4 sm:p-6">
                  <DoctorsSection doctors={doctors} />
                </div>
              </>
            )}

            {hasDocuments && (
              <>
                <input
                  type="radio"
                  name="member_profile_tabs"
                  role="tab"
                  className="tab"
                  aria-label="Documents"
                  defaultChecked={firstTab === 'documents'}
                />
                <div role="tabpanel" className="tab-content rounded-box p-4 sm:p-6">
                  <DocumentsSection documents={documents} />
                </div>
              </>
            )}

            {hasContacts && (
              <>
                <input
                  type="radio"
                  name="member_profile_tabs"
                  role="tab"
                  className="tab"
                  aria-label="Contacts"
                  defaultChecked={firstTab === 'contacts'}
                />
                <div role="tabpanel" className="tab-content rounded-box p-4 sm:p-6">
                  <ContactsDisplay contacts={contacts} />
                </div>
              </>
            )}
          </div>
        </>
      )}

      {!hasPersonalInfo &&
        !hasBloodType &&
        !hasAnamneses &&
        !hasDoctors &&
        !hasDocuments &&
        !hasContacts && (
          <>
            <Divider addClass="my-1" />
            <div className="p-8 text-center text-gray-500">
              <p>No medical information available yet.</p>
              <p className="text-sm mt-2">Please update your profile to add details.</p>
            </div>
          </>
        )}
    </div>
  );
}