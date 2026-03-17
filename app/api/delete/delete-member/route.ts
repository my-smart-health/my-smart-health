import prisma from '@/lib/db';
import { auth } from '@/auth';
import {
  deleteS3ObjectByKey,
  extractS3KeyFromUrlOrPath,
  listS3KeysByPrefix,
} from '@/lib/s3-storage';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

type FileWithDescription = {
  url: string;
  description?: string;
};

type MedicationPlanEntry = {
  fileUrl?: unknown;
  [key: string]: unknown;
};

type AnamnesisEntry = {
  medicationPlan?: {
    medicationPlanTable?: unknown;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

const toFileArray = (value: unknown): FileWithDescription[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is { url: unknown; description?: unknown } =>
        typeof item === 'object' && item !== null && 'url' in item,
    )
    .map((item) => ({
      url: String(item.url ?? '').trim(),
      description:
        item.description !== undefined
          ? String(item.description ?? '').trim()
          : undefined,
    }))
    .filter((item) => item.url.length > 0);
};

const toAnamnesesArray = (value: unknown): AnamnesisEntry[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is AnamnesisEntry => typeof item === 'object' && item !== null,
  );
};

const collectMemberFileKeys = (member: {
  bloodTypeFiles: unknown;
  documents: unknown;
  anamneses: unknown;
}) => {
  const keys = new Set<string>();

  for (const file of toFileArray(member.bloodTypeFiles)) {
    keys.add(extractS3KeyFromUrlOrPath(file.url));
  }

  for (const file of toFileArray(member.documents)) {
    keys.add(extractS3KeyFromUrlOrPath(file.url));
  }

  const anamneses = toAnamnesesArray(member.anamneses);
  for (const anamnesis of anamneses) {
    const medicationPlanTable = Array.isArray(
      anamnesis.medicationPlan?.medicationPlanTable,
    )
      ? (anamnesis.medicationPlan?.medicationPlanTable as unknown[])
      : [];

    for (const medicationEntry of medicationPlanTable) {
      const medication = medicationEntry as MedicationPlanEntry;
      for (const file of toFileArray(medication.fileUrl)) {
        keys.add(extractS3KeyFromUrlOrPath(file.url));
      }
    }
  }

  return keys;
};

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || searchParams.get('memberId');
    if (!id) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 },
      );
    }

    const member = await prisma.memberProfile.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        bloodTypeFiles: true,
        documents: true,
        anamneses: true,
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    if (member.role !== 'MEMBER') {
      return NextResponse.json(
        { error: 'Only MEMBER profiles can be deleted via this endpoint' },
        { status: 400 },
      );
    }

    const keysToDelete = collectMemberFileKeys(member);

    const privatePrefixKeys = await listS3KeysByPrefix(`${id}/`, 'private');
    const publicPrefixKeys = await listS3KeysByPrefix(`${id}/`, 'public');

    for (const key of [...privatePrefixKeys, ...publicPrefixKeys]) {
      keysToDelete.add(key);
    }

    const failedFileKeys: string[] = [];

    for (const key of keysToDelete) {
      try {
        await deleteS3ObjectByKey(key, 'private');
      } catch {
        try {
          await deleteS3ObjectByKey(key, 'public');
        } catch {
          failedFileKeys.push(key);
        }
      }
    }

    if (failedFileKeys.length > 0) {
      return NextResponse.json(
        {
          error: 'Failed to delete all member files before deleting member',
          failedFilesCount: failedFileKeys.length,
          failedFileKeys:
            process.env.NODE_ENV === 'development' ? failedFileKeys : undefined,
        },
        { status: 500 },
      );
    }

    const deletedMember = await prisma.memberProfile.delete({
      where: { id },
    });

    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/all-members');
    revalidatePath(`/dashboard/member/${id}`);
    revalidatePath(`/dashboard/edit-member/${id}`);
    revalidatePath(`/profile-member/${id}`);

    return NextResponse.json(
      {
        message: 'Member deleted successfully',
        data: deletedMember,
        deletedFilesCount: keysToDelete.size,
      },
      { status: 200 },
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error deleting member:', error);
    }
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 },
    );
  }
}
