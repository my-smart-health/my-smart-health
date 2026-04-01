'use client';

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import {
  PersonalInfoSection,
  BloodTypeSection,
  AnamnesesSection,
  DoctorsSection,
  DocumentsSection,
  AdminOnlySection,
  ContactsDisplay,
  SpecialNumbersSection,
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
  const t = useTranslations("MemberProfileFull");
  const [mounted, setMounted] = useState(false);
  const [contacts, setContacts] = useState<ContactDoctor[]>([]);

  useEffect(() => setMounted(true), []);

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

    if (mounted && member?.id) {
      fetchContacts();
    }
  }, [mounted, member?.id]);

  if (!mounted) return null;

  if (!member) {
    return (
      <div className="flex flex-col gap-4 p-4 w-full">
        <p className="text-red-500 text-center">{t("profileNotFound")}</p>
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
    phoneNumbers,
    anamneses,
    doctors,
    documents,
    familyMembers,
    telMedicineNumbers,
    isActive,
    activeUntil,
    createdAt,
    updatedAt,
  } = member;

  const hasPersonalInfo = birthday || heightCm || weightKg || (healthInsurances && healthInsurances.length > 0) || (familyMembers && familyMembers.length > 0) || (phoneNumbers && phoneNumbers.length > 0);
  const hasBloodType = bloodType || (bloodTypeFiles && bloodTypeFiles.length > 0);
  const hasAnamneses = anamneses && anamneses.length > 0;
  const hasDoctors = doctors && doctors.length > 0;
  const hasDocuments = documents && documents.length > 0;
  const hasContacts = contacts && contacts.length > 0;
  const hasSpecialNumbers = isActive && telMedicineNumbers && telMedicineNumbers.length > 0;
  const hasAdminInfo = isAdmin;

  const tabClassName = "tab border-x border-t rounded border-primary";
  const tabPanelClassName = "tab-content rounded-box p-4 sm:p-6";

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
                : hasSpecialNumbers
                  ? 'special'
                  : null;

  return (
    <div className="flex flex-col gap-1 p-2 sm:p-3 w-full max-w-full overflow-hidden">
      <section className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center w-full gap-2">
          <h2 className="font-bold self-end text-primary text-xl break-words">
            {name || t("defaultTitle")}
          </h2>
          <GoBack />
        </div>
      </section>

      {(hasAdminInfo || hasPersonalInfo || hasAnamneses || hasBloodType || hasDoctors || hasDocuments || hasContacts || hasSpecialNumbers) && (
        <>
          <Divider addClass="my-1" />
          <div role="tablist" className="tabs tabs-lifted tabs-lg w-full">
            {hasAdminInfo && (
              <>
                <input
                  type="radio"
                  name="member_profile_tabs"
                  role="tab"
                  className={tabClassName}
                  aria-label={t("tabs.admin")}
                  defaultChecked={firstTab === 'admin'}
                />
                <div role="tabpanel" className={tabPanelClassName}>
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
                  className={tabClassName}
                  aria-label={t("tabs.personalInfo")}
                  defaultChecked={firstTab === 'personal'}
                />
                <div role="tabpanel" className={tabPanelClassName}>
                  <PersonalInfoSection
                    birthday={birthday}
                    heightCm={heightCm}
                    weightKg={weightKg}
                    phoneNumbers={phoneNumbers}
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
                  className={tabClassName}
                  aria-label={t("tabs.anamneses")}
                  defaultChecked={firstTab === 'anamneses'}
                />
                <div role="tabpanel" className={tabPanelClassName}>
                  <AnamnesesSection
                    memberId={member.id}
                    anamneses={anamneses}
                  />
                </div>
              </>
            )}

            {hasBloodType && (
              <>
                <input
                  type="radio"
                  name="member_profile_tabs"
                  role="tab"
                  className={tabClassName}
                  aria-label={t("tabs.bloodType")}
                  defaultChecked={firstTab === 'blood'}
                />
                <div role="tabpanel" className={tabPanelClassName}>
                  <BloodTypeSection
                    memberId={member.id}
                    bloodType={bloodType}
                    bloodTypeFiles={bloodTypeFiles}
                  />
                </div>
              </>
            )}

            {hasDoctors && (
              <>
                <input
                  type="radio"
                  name="member_profile_tabs"
                  role="tab"
                  className={tabClassName}
                  aria-label={t("tabs.doctors")}
                  defaultChecked={firstTab === 'doctors'}
                />
                <div role="tabpanel" className={tabPanelClassName}>
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
                  className={tabClassName}
                  aria-label={t("tabs.documents")}
                  defaultChecked={firstTab === 'documents'}
                />
                <div role="tabpanel" className={tabPanelClassName}>
                  <DocumentsSection
                    memberId={member.id}
                    documents={documents}
                  />
                </div>
              </>
            )}

            {hasContacts && (
              <>
                <input
                  type="radio"
                  name="member_profile_tabs"
                  role="tab"
                  className={tabClassName}
                  aria-label={t("tabs.contacts")}
                  defaultChecked={firstTab === 'contacts'}
                />
                <div role="tabpanel" className={tabPanelClassName}>
                  <ContactsDisplay contacts={contacts} />
                </div>
              </>
            )}

            {hasSpecialNumbers && (
              <>
                <input
                  type="radio"
                  name="member_profile_tabs"
                  role="tab"
                  className={tabClassName}
                  aria-label={t("tabs.telemedicine")}
                  defaultChecked={firstTab === 'special'}
                />
                <div role="tabpanel" className={tabPanelClassName}>
                  <SpecialNumbersSection specialNumbers={telMedicineNumbers} />
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
        !hasContacts &&
        !hasSpecialNumbers && (
          <>
            <Divider addClass="my-1" />
            <div className="p-8 text-center text-gray-500">
              <p>{t("noMedicalInfoTitle")}</p>
              <p className="text-sm mt-2">{t("noMedicalInfoSubtitle")}</p>
            </div>
          </>
        )}
    </div>
  );
}