import prisma from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CACHE_STRATEGY } from "@/utils/constants";
import EditMemberForm from "@/components/profile/edit-member-form/EditMemberForm";
import { HealthInsurances, MyDoctors, Anamneses, FamilyMember, FileWithDescription } from "@/utils/types";


async function getMember(id: string) {
  const member = await prisma.memberProfile.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      name: true,
      birthday: true,
      heightCm: true,
      weightKg: true,
      healthInsurances: true,
      bloodType: true,
      bloodTypeFiles: true,
      anamneses: true,
      documents: true,
      doctors: true,
      familyMembers: true,
      isActive: true,
      activeUntil: true,
    },
    cacheStrategy: CACHE_STRATEGY.NONE,
  });

  return member;
}

export default async function EditMemberByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session || !session.user) {
    return redirect("/login");
  }

  const isAdmin = session.user.role === "ADMIN";
  const isOwner = session.user.id === id;

  if (!isAdmin && !isOwner) {
    return redirect("/dashboard");
  }

  if (!id) {
    return redirect("/dashboard/all-members");
  }

  const member = await getMember(id);

  if (!member) {
    return redirect("/dashboard/all-members");
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const sanitizeFileUrls = (files: unknown): FileWithDescription[] => {
    if (!Array.isArray(files)) return [];
    return (files as FileWithDescription[])
      .filter(file => file && typeof file === 'object' && 'url' in file)
      .map(file => ({
        url: file.url || '',
        description: file.description || '',
      }))
      .filter(file => {
        const url = file.url.trim();
        return url && url.length > 0 && url !== 'File' && url !== 'file';
      });
  };

  const sanitizeAnamneses = (anamneses: unknown): Anamneses[] => {
    if (!Array.isArray(anamneses)) return [];
    return (anamneses as Anamneses[]).map(anamnesis => ({
      ...anamnesis,
      medicationPlan: {
        ...anamnesis.medicationPlan,
        medicationPlanTable: anamnesis.medicationPlan?.medicationPlanTable?.map(med => ({
          ...med,
          fileUrl: med.fileUrl ? sanitizeFileUrls(med.fileUrl) : null,
        })) || [],
      },
    }));
  };

  const safeMember = {
    ...member,
    createdAt: formatDateTime(member.createdAt),
    updatedAt: formatDateTime(member.updatedAt),
    birthday: member.birthday ? member.birthday.toISOString() : null,
    activeUntil: member.activeUntil ? member.activeUntil.toISOString() : null,
    heightCm: member.heightCm ? parseFloat(member.heightCm.toString()) : null,
    weightKg: member.weightKg ? parseFloat(member.weightKg.toString()) : null,
    bloodTypeFiles: sanitizeFileUrls(member.bloodTypeFiles),
    documents: sanitizeFileUrls(member.documents),
    anamneses: sanitizeAnamneses(member.anamneses),
    healthInsurances: (Array.isArray(member.healthInsurances) ? member.healthInsurances : []) as HealthInsurances[],
    doctors: (Array.isArray(member.doctors) ? member.doctors : []) as MyDoctors[],
    familyMembers: (Array.isArray(member.familyMembers) ? member.familyMembers : []) as FamilyMember[],
  };

  return (
    <>
      <h1 className="text-4xl font-extrabold text-primary mb-2">Edit Member Profile</h1>
      <EditMemberForm
        member={safeMember}
        afterCloseHref={isAdmin ? `/dashboard/member/${id}` : "/dashboard"}
        isAdmin={isAdmin}
      />
    </>
  );
}
