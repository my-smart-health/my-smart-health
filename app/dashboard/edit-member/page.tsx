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

export default async function EditMemberPage() {
  const session = await auth();

  if (!session || !session.user) {
    return redirect("/login");
  }

  if (session.user.role !== "MEMBER") {
    return redirect("/dashboard");
  }

  const member = await getMember(session.user.id);

  if (!member) {
    return redirect("/dashboard");
  }

  const safeMember = {
    ...member,
    createdAt: member.createdAt.toISOString(),
    updatedAt: member.updatedAt.toISOString(),
    birthday: member.birthday ? member.birthday.toISOString() : null,
    activeUntil: member.activeUntil ? member.activeUntil.toISOString() : null,
    heightCm: member.heightCm ? parseFloat(member.heightCm.toString()) : null,
    weightKg: member.weightKg ? parseFloat(member.weightKg.toString()) : null,
    bloodTypeFiles: Array.isArray(member.bloodTypeFiles)
      ? (member.bloodTypeFiles as unknown as FileWithDescription[])
      : [],
    documents: Array.isArray(member.documents)
      ? (member.documents as unknown as FileWithDescription[])
      : [],
    anamneses: (Array.isArray(member.anamneses) ? member.anamneses : []) as Anamneses[],
    healthInsurances: (Array.isArray(member.healthInsurances) ? member.healthInsurances : []) as HealthInsurances[],
    doctors: (Array.isArray(member.doctors) ? member.doctors : []) as MyDoctors[],
    familyMembers: (Array.isArray(member.familyMembers) ? member.familyMembers : []) as FamilyMember[],
  };

  return (
    <>
      <h1 className="text-4xl font-extrabold text-primary mb-2">Edit Member Profile</h1>
      <EditMemberForm member={safeMember} afterCloseHref="/dashboard" />
    </>
  );
}
