'use client';

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SaveAll } from "lucide-react";

import Divider from "@/components/divider/Divider";
import { MemberProfileDashboardProps, HealthInsurances, MyDoctors, Anamneses, FamilyMember, FileWithDescription } from "@/utils/types";
import {
  cleanupHealthInsurances,
  cleanupDoctors,
  cleanupAnamneses,
  cleanupBloodType,
  cleanupBloodTypeFiles,
  cleanupFamilyMembers,
  cleanupDocuments,
} from "@/utils/common";

import {
  BasicInfoSection,
  StatusSection,
  PersonalInfoSection,
  BloodTypeSection,
  HealthInsurancesSection,
  DoctorsSection,
  AnamnesesSection,
  DocumentsSection,
  FamilyMembersSection,
  ContactsSection,
  AddContactModal,
} from "./_components";

type ContactDoctor = {
  id: string;
  name: string | null;
  profileImages: string[] | null;
  fieldOfExpertise: Array<{ name: string }> | null;
  displayEmail: string | null;
  phones: string[];
};

function toDateInputValue(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function EditMemberForm({
  member,
  afterCloseHref = "/dashboard",
  isAdmin = false,
}: {
  member: MemberProfileDashboardProps;
  afterCloseHref?: string;
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const statusModalRef = useRef<HTMLDialogElement>(null);

  const [name, setName] = useState(member?.name ?? "");
  const [email, setEmail] = useState(member?.email ?? "");

  const [isActive, setIsActive] = useState(Boolean(member?.isActive));
  const [activeUntil, setActiveUntil] = useState(toDateInputValue(member?.activeUntil));

  const [birthday, setBirthday] = useState(toDateInputValue(member?.birthday));
  const [heightCm, setHeightCm] = useState(member?.heightCm ? String(member.heightCm) : "");
  const [weightKg, setWeightKg] = useState(member?.weightKg ? String(member.weightKg) : "");

  const [bloodType, setBloodType] = useState(member?.bloodType ?? "");
  const [bloodTypeFiles, setBloodTypeFiles] = useState<FileWithDescription[]>(member?.bloodTypeFiles || []);

  const [healthInsurances, setHealthInsurances] = useState<HealthInsurances[]>(member?.healthInsurances || []);
  const [doctors, setDoctors] = useState<MyDoctors[]>(member?.doctors || []);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(member?.familyMembers || []);

  const [anamneses, setAnamneses] = useState<Anamneses[]>(member?.anamneses || []);
  const [documents, setDocuments] = useState<FileWithDescription[]>(member?.documents || []);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [contacts, setContacts] = useState<ContactDoctor[]>([]);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`/api/member/contacts?memberId=${member?.id}`);
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

  const handleStatusClose = () => {
    const wasSuccess = success !== null;
    setError(null);
    setSuccess(null);
    statusModalRef.current?.close();

    if (wasSuccess) {
      router.push(afterCloseHref);
      router.refresh();
    }
  };

  useEffect(() => {
    if (error || success) {
      statusModalRef.current?.showModal();
    }
  }, [error, success]);

  const successCtaLabel = afterCloseHref.startsWith("/dashboard/member/")
    ? "Zum Mitgliederprofil"
    : "Zum Dashboard";

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    const payload = {
      name: name.trim().length > 0 ? name.trim() : null,
      email: email.trim(),
      birthday: birthday ? new Date(`${birthday}T00:00:00.000Z`) : null,
      heightCm: heightCm.trim().length > 0 ? parseFloat(heightCm.trim()) : null,
      weightKg: weightKg.trim().length > 0 ? parseFloat(weightKg.trim()) : null,
      bloodType: cleanupBloodType(bloodType),
      bloodTypeFiles: cleanupBloodTypeFiles(bloodTypeFiles),
      documents: cleanupDocuments(documents),
      anamneses: cleanupAnamneses(anamneses),
      healthInsurances: cleanupHealthInsurances(healthInsurances),
      doctors: cleanupDoctors(doctors),
      familyMembers: cleanupFamilyMembers(familyMembers),
      isActive,
      activeUntil: activeUntil ? new Date(`${activeUntil}T00:00:00.000Z`) : null,
    };

    try {
      setIsSaving(true);
      const res = await fetch("/api/update/update-member-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: member?.id, data: payload }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setError(json?.message || "Failed to update member profile");
        return;
      }

      setSuccess("Member profile updated successfully");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSave();
  };

  if (!member) {
    return (
      <div className="w-full text-center p-8">
        <p className="text-red-500">Member not found</p>
      </div>
    );
  }

  return (
    <>
      {(error || success) && (
        <dialog
          ref={statusModalRef}
          id="edit_member_status_modal"
          className="modal modal-bottom fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 z-50 backdrop-grayscale-100 transition-all ease-linear duration-500"
          style={{ backgroundColor: "transparent" }}
          onClose={handleStatusClose}
        >
          <div
            className={`modal-box ${success ? "bg-green-500" : "bg-red-500"} text-white rounded-2xl w-[95%]`}
            style={{
              width: "80vw",
              maxWidth: "80vw",
              margin: "2rem auto",
              left: 0,
              right: 0,
              bottom: 0,
              position: "fixed",
              minHeight: "unset",
              padding: "2rem 1.5rem",
            }}
          >
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white"
                onClick={handleStatusClose}
                type="button"
              >
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">{success ? "Erfolg" : "Fehler"}</h3>
            <p className="py-4 text-center">{success || error}</p>
            {success && (
              <div className="flex justify-center">
                <button
                  type="button"
                  className="btn btn-white btn-outline text-white hover:bg-white hover:text-green-600"
                  onClick={handleStatusClose}
                >
                  {successCtaLabel}
                </button>
              </div>
            )}
          </div>
        </dialog>
      )}

      <form onSubmit={handleSubmit} className="w-full">
        <Divider addClass="mb-4" />

        <div className="tabs tabs-lift m-2 w-full mx-auto max-w-[96%]">
          <input type="radio" name="member_tabs" className="tab" aria-label="Basic Info" defaultChecked />
          <div className="tab-content border-primary p-3 md:p-10">
            <BasicInfoSection
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              memberId={member.id}
              role={member.role}
              createdAt={member.createdAt}
              updatedAt={member.updatedAt}
              isAdmin={isAdmin}
            />
          </div>

          {isAdmin && (
            <>
              <input type="radio" name="member_tabs" className="tab" aria-label="Status" />
              <div className="tab-content border-primary p-3 md:p-10">
                <StatusSection
                  isActive={isActive}
                  setIsActive={setIsActive}
                  activeUntil={activeUntil}
                  setActiveUntil={setActiveUntil}
                />
              </div>
            </>
          )}

          <input type="radio" name="member_tabs" className="tab" aria-label="Personal" />
          <div className="tab-content border-primary p-3 md:p-10">
            <PersonalInfoSection
              birthday={birthday}
              setBirthday={setBirthday}
              heightCm={heightCm}
              setHeightCm={setHeightCm}
              weightKg={weightKg}
              setWeightKg={setWeightKg}
            />

          </div>

          <input type="radio" name="member_tabs" className="tab" aria-label="Anamneses / Medication Plan" />
          <div className="tab-content border-primary p-3 md:p-10">

            <AnamnesesSection
              anamneses={anamneses}
              setAnamneses={setAnamneses}
            />
          </div>

          <input type="radio" name="member_tabs" className="tab" aria-label="Blood Type" />
          <div className="tab-content border-primary p-3 md:p-10">
            <BloodTypeSection
              bloodType={bloodType}
              setBloodType={setBloodType}
              bloodTypeFiles={bloodTypeFiles}
              setBloodTypeFiles={setBloodTypeFiles}
            />
          </div>

          <input type="radio" name="member_tabs" className="tab" aria-label="Health Insurance" />
          <div className="tab-content border-primary p-3 md:p-10">
            <HealthInsurancesSection
              healthInsurances={healthInsurances}
              setHealthInsurances={setHealthInsurances}
            />
          </div>

          <input type="radio" name="member_tabs" className="tab" aria-label="Doctors" />
          <div className="tab-content border-primary p-3 md:p-10">
            <DoctorsSection
              doctors={doctors}
              setDoctors={setDoctors}
            />
          </div>

          <input type="radio" name="member_tabs" className="tab" aria-label="Family Members" />
          <div className="tab-content border-primary p-3 md:p-10">
            <FamilyMembersSection
              familyMembers={familyMembers}
              setFamilyMembers={setFamilyMembers}
            />
          </div>

          <input type="radio" name="member_tabs" className="tab" aria-label="Documents" />
          <div className="tab-content border-primary p-3 md:p-10">
            <DocumentsSection
              documents={documents}
              setDocuments={setDocuments}
            />
          </div>

          <input type="radio" name="member_tabs" className="tab" aria-label="Contacts" />
          <div className="tab-content border-primary p-3 md:p-10">
            <ContactsSection
              memberId={member.id}
              contacts={contacts}
              setContacts={setContacts}
              onAddClick={() => setIsAddContactModalOpen(true)}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col w-full mt-4 p-4 border border-primary gap-4">
          <button
            type="submit"
            className="btn btn-success m-4 text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-300 ease-in-out"
            disabled={isSaving}
          >
            <SaveAll /> {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <AddContactModal
        isOpen={isAddContactModalOpen}
        onClose={() => setIsAddContactModalOpen(false)}
        memberId={member.id}
        onContactAdded={(contact) => {
          setContacts([...contacts, contact]);
        }}
        existingContactIds={contacts.map(c => c.id)}
      />
    </>
  );
}
