import prisma from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CACHE_STRATEGY } from "@/utils/constants";

import ProfileFullMember from "@/components/profile/profile-full-member/ProfileFullMember";
import Link from "next/link";
import {
  HealthInsurances,
  MyDoctors,
  MemberProfileDashboardProps,
  Anamneses,
  FamilyMember,
  FileWithDescription,
} from "@/utils/types";

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

  if (!member) return null;

  const safeMember: MemberProfileDashboardProps = {
    ...member,
    createdAt: member.createdAt.toISOString(),
    updatedAt: member.updatedAt.toISOString(),
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
  };

  return safeMember;
}

export default async function MemberProfilePage({
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
    return redirect("/dashboard");
  }

  const member = await getMember(id);

  if (!member) {
    return redirect(isAdmin ? "/dashboard/all-members" : "/dashboard");
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-4xl font-extrabold text-primary mb-2">Member Profile</h1>
        <Link
          href={`/dashboard/edit-member/${id}`}
          className="btn btn-wide btn-warning self-center rounded-xl underline"
        >
          Edit Member Profile
        </Link>
      </div>
      <ProfileFullMember member={member} isAdmin={isAdmin} />
    </>
  );
}
