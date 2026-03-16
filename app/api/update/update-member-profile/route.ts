import prisma from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

function parseNullableInt(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? null : parsed;
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id, data } = await req.json();

    if (!id || !data) {
      return NextResponse.json(
        { message: 'Member ID and data are required' },
        { status: 400 },
      );
    }

    if (id !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updateData: Prisma.MemberProfileUpdateInput = {
      ...(data.name !== undefined && { name: data.name?.trim() || null }),
      ...(data.email !== undefined && { email: data.email?.trim() }),
      ...(data.bloodType !== undefined && {
        bloodType: data.bloodType || null,
      }),
      ...(data.birthday !== undefined && {
        birthday: data.birthday ? new Date(data.birthday) : null,
      }),
      ...(data.activeUntil !== undefined && {
        activeUntil: data.activeUntil ? new Date(data.activeUntil) : null,
      }),
      ...(data.heightCm !== undefined && {
        heightCm: parseNullableInt(data.heightCm),
      }),
      ...(data.weightKg !== undefined && {
        weightKg: parseNullableInt(data.weightKg),
      }),
      ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
      ...(data.bloodTypeFiles !== undefined && {
        bloodTypeFiles: data.bloodTypeFiles || [],
      }),
      ...(data.documents !== undefined && { documents: data.documents || [] }),
      ...(data.anamneses !== undefined && { anamneses: data.anamneses || [] }),
      ...(data.healthInsurances !== undefined && {
        healthInsurances:
          Array.isArray(data.healthInsurances) &&
          data.healthInsurances.length === 0
            ? Prisma.JsonNull
            : data.healthInsurances || Prisma.JsonNull,
      }),
      ...(data.doctors !== undefined && {
        doctors:
          Array.isArray(data.doctors) && data.doctors.length === 0
            ? Prisma.JsonNull
            : data.doctors || Prisma.JsonNull,
      }),
      ...(data.familyMembers !== undefined && {
        familyMembers:
          Array.isArray(data.familyMembers) && data.familyMembers.length === 0
            ? Prisma.JsonNull
            : data.familyMembers || Prisma.JsonNull,
      }),
      ...(data.telMedicineNumbers !== undefined && {
        telMedicineNumbers:
          Array.isArray(data.telMedicineNumbers) &&
          data.telMedicineNumbers.length === 0
            ? Prisma.JsonNull
            : data.telMedicineNumbers || Prisma.JsonNull,
      }),
    };

    const updated = await prisma.memberProfile.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/all-members');
    revalidatePath(`/dashboard/edit-member/${id}`);
    revalidatePath(`/dashboard/member/${id}`);

    return NextResponse.json({
      message: 'Member profile updated',
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Failed to update member profile',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
