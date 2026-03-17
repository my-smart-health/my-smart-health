import prisma from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CACHE_STRATEGY } from "@/utils/constants";

import ProfileFullMember from "@/components/profile/profile-full-member/ProfileFullMember";
import {
  HealthInsurances,
  MyDoctors,
  MemberProfileDashboardProps,
  Anamneses,
  FamilyMember,
  FileWithDescription,
  TelMedicinePhoneNumber,
} from "@/utils/types";
import GoBack from "@/components/buttons/go-back/GoBack";

async function getMemberForContact(memberId: string, viewerId: string) {
  const hasAccess = await prisma.memberDoctor.findFirst({
    where: {
      memberId: memberId,
      doctorId: viewerId,
    },
  });

  if (!hasAccess) {
    return null;
  }

  const member = await prisma.memberProfile.findUnique({
    where: { id: memberId },
    select: {
      id: true,
      email: true,
      phoneNumbers: true,
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
      telMedicineNumbers: true,
      isActive: true,
      activeUntil: true,
    },
    cacheStrategy: CACHE_STRATEGY.NONE,
  });

  if (!member) return null;

  const safeMember: MemberProfileDashboardProps = {
    ...member,
    createdAt: member.createdAt.toISOString(),
    updatedAt: member.updatedAt.toISOString(),
    phoneNumbers: Array.isArray(member.phoneNumbers) ? member.phoneNumbers : [],
    birthday: member.birthday ? member.birthday.toISOString() : null,
    activeUntil: member.activeUntil ? member.activeUntil.toISOString() : null,
    heightCm: member.heightCm ? Number(member.heightCm.toString()) : null,
    weightKg: member.weightKg ? Number(member.weightKg.toString()) : null,
    healthInsurances: Array.isArray(member.healthInsurances)
      ? (member.healthInsurances as unknown as HealthInsurances[])
      : [],
    doctors: Array.isArray(member.doctors)
      ? (member.doctors as unknown as MyDoctors[])
      : [],
    anamneses: Array.isArray(member.anamneses)
      ? (member.anamneses as unknown as Anamneses[])
      : [],
    bloodTypeFiles: Array.isArray(member.bloodTypeFiles)
      ? (member.bloodTypeFiles as unknown as FileWithDescription[])
      : [],
    documents: Array.isArray(member.documents)
      ? (member.documents as unknown as FileWithDescription[])
      : [],
    familyMembers: Array.isArray(member.familyMembers)
      ? (member.familyMembers as unknown as FamilyMember[])
      : [],
    telMedicineNumbers: Array.isArray(member.telMedicineNumbers)
      ? (member.telMedicineNumbers as unknown as TelMedicinePhoneNumber[])
      : [],
  };

  return safeMember;
}

export default async function MemberPublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session || !session.user) {
    return redirect("/login");
  }

  if (session.user.role === "MEMBER") {
    return redirect("/dashboard");
  }

  if (session.user.role === "ADMIN") {
    return redirect(`/dashboard/member/${id}`);
  }

  if (!id) {
    return redirect("/dashboard");
  }

  const member = await getMemberForContact(id, session.user.id);

  if (!member) {
    return (
      <div className="flex flex-col gap-4 p-4 w-full items-center justify-center min-h-[60vh]">
        <h1 className="text-3xl font-bold text-error">Access Denied</h1>
        <p className="text-lg text-center">
          You don&apos;t have permission to view this member profile.
        </p>
        <p className="text-sm text-center text-gray-600">
          This member has not added you to their contacts list.
        </p>
        <GoBack />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-4xl font-extrabold text-primary mb-2">Member Profile</h1>
      </div>
      <ProfileFullMember member={member} isAdmin={false} />
    </>
  );
}
