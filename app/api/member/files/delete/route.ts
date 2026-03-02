import prisma from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import {
  deleteS3ObjectByKey,
  extractS3KeyFromUrlOrPath,
  resolveS3BucketVisibilityFromUrlOrPath,
} from '@/lib/s3-storage';

type FileWithDescription = {
  url: string;
  description?: string;
};

type MemberFileTarget =
  | 'bloodTypeFiles'
  | 'documents'
  | 'anamnesesMedicationPlan';

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

const MEMBER_FILE_TARGETS: MemberFileTarget[] = [
  'bloodTypeFiles',
  'documents',
  'anamnesesMedicationPlan',
];

const parseIndex = (value: string | null) => {
  if (value === null) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
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

const isManagedS3Url = (url: string) => {
  const publicBucket = process.env.S3_BUCKET_PUBLIC;
  const privateBucket = process.env.S3_BUCKET_PRIVATE;

  if (!publicBucket && !privateBucket) {
    return false;
  }

  try {
    const parsed = new URL(url);
    const path = parsed.pathname.replace(/^\/+/, '');
    return (
      (publicBucket ? path.startsWith(`${publicBucket}/`) : false) ||
      (privateBucket ? path.startsWith(`${privateBucket}/`) : false)
    );
  } catch {
    return false;
  }
};

const toObjectKey = (value: string) => extractS3KeyFromUrlOrPath(value);

const hasManagedStorageReference = (value: string, memberId: string) => {
  const extractedKey = toObjectKey(value);
  if (extractedKey.startsWith(`${memberId}/`)) {
    return true;
  }

  return isManagedS3Url(value);
};

const matchesFileReference = (candidate: string, target: string) =>
  toObjectKey(candidate) === toObjectKey(target);

const removeFileFromAnamneses = (
  anamneses: AnamnesisEntry[],
  fileReference: string,
  anamnesisIndex?: number,
  medicationIndex?: number,
) => {
  const updated = [...anamneses];
  let removedCount = 0;

  const applyRemovalOnMedication = (entry: MedicationPlanEntry) => {
    const nextFiles = toFileArray(entry.fileUrl).filter((file) => {
      const shouldKeep = !matchesFileReference(file.url, fileReference);
      if (!shouldKeep) {
        removedCount += 1;
      }
      return shouldKeep;
    });

    return {
      ...entry,
      fileUrl: nextFiles.length > 0 ? nextFiles : null,
    };
  };

  if (anamnesisIndex !== undefined && medicationIndex !== undefined) {
    const selectedAnamnesis = updated[anamnesisIndex];
    if (!selectedAnamnesis) {
      return { updated, removedCount, invalidIndex: true };
    }

    const medicationPlanTable = Array.isArray(
      selectedAnamnesis.medicationPlan?.medicationPlanTable,
    )
      ? [
          ...(selectedAnamnesis.medicationPlan
            ?.medicationPlanTable as unknown[]),
        ]
      : [];

    if (!medicationPlanTable[medicationIndex]) {
      return { updated, removedCount, invalidIndex: true };
    }

    medicationPlanTable[medicationIndex] = applyRemovalOnMedication(
      medicationPlanTable[medicationIndex] as MedicationPlanEntry,
    );

    updated[anamnesisIndex] = {
      ...selectedAnamnesis,
      medicationPlan: {
        ...(selectedAnamnesis.medicationPlan || {}),
        medicationPlanTable,
      },
    };

    return { updated, removedCount, invalidIndex: false };
  }

  for (let anamIndex = 0; anamIndex < updated.length; anamIndex += 1) {
    const selectedAnamnesis = updated[anamIndex];

    const medicationPlanTable = Array.isArray(
      selectedAnamnesis.medicationPlan?.medicationPlanTable,
    )
      ? [
          ...(selectedAnamnesis.medicationPlan
            ?.medicationPlanTable as unknown[]),
        ]
      : [];

    const nextMedicationPlanTable = medicationPlanTable.map((entry) =>
      applyRemovalOnMedication(entry as MedicationPlanEntry),
    );

    updated[anamIndex] = {
      ...selectedAnamnesis,
      medicationPlan: {
        ...(selectedAnamnesis.medicationPlan || {}),
        medicationPlanTable: nextMedicationPlanTable,
      },
    };
  }

  return { updated, removedCount, invalidIndex: false };
};

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');
    const fileReference = searchParams.get('fileUrl');
    const target = searchParams.get('target') as MemberFileTarget | null;
    const anamnesisIndex = parseIndex(searchParams.get('anamnesisIndex'));
    const medicationIndex = parseIndex(searchParams.get('medicationIndex'));

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 },
      );
    }

    if (!fileReference) {
      return NextResponse.json(
        { error: 'fileUrl is required' },
        { status: 400 },
      );
    }

    if (target && !MEMBER_FILE_TARGETS.includes(target)) {
      return NextResponse.json(
        {
          error:
            'Target must be one of: bloodTypeFiles, documents, anamnesesMedicationPlan',
        },
        { status: 400 },
      );
    }

    if (memberId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const member = await prisma.memberProfile.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        bloodTypeFiles: true,
        documents: true,
        anamneses: true,
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    let removedCount = 0;
    let invalidIndex = false;

    const currentBloodTypeFiles = toFileArray(member.bloodTypeFiles);
    const currentDocuments = toFileArray(member.documents);
    const currentAnamneses = toAnamnesesArray(member.anamneses);

    let nextBloodTypeFiles = currentBloodTypeFiles;
    let nextDocuments = currentDocuments;
    let nextAnamneses = currentAnamneses;

    if (!target || target === 'bloodTypeFiles') {
      nextBloodTypeFiles = currentBloodTypeFiles.filter((file) => {
        const shouldKeep = !matchesFileReference(file.url, fileReference);
        if (!shouldKeep) {
          removedCount += 1;
        }
        return shouldKeep;
      });
    }

    if (!target || target === 'documents') {
      nextDocuments = currentDocuments.filter((file) => {
        const shouldKeep = !matchesFileReference(file.url, fileReference);
        if (!shouldKeep) {
          removedCount += 1;
        }
        return shouldKeep;
      });
    }

    if (!target || target === 'anamnesesMedicationPlan') {
      const nextAnamnesesResult = removeFileFromAnamneses(
        currentAnamneses,
        fileReference,
        anamnesisIndex !== null ? anamnesisIndex : undefined,
        medicationIndex !== null ? medicationIndex : undefined,
      );

      if (nextAnamnesesResult.invalidIndex) {
        invalidIndex = true;
      }

      removedCount += nextAnamnesesResult.removedCount;
      nextAnamneses = nextAnamnesesResult.updated;
    }

    if (invalidIndex) {
      return NextResponse.json(
        { error: 'Invalid anamnesisIndex or medicationIndex' },
        { status: 400 },
      );
    }

    if (removedCount === 0) {
      return NextResponse.json(
        { error: 'File URL not found in member profile' },
        { status: 404 },
      );
    }

    const updateData: {
      bloodTypeFiles?: FileWithDescription[];
      documents?: FileWithDescription[];
      anamneses?: AnamnesisEntry[];
    } = {};

    if (!target || target === 'bloodTypeFiles') {
      updateData.bloodTypeFiles = nextBloodTypeFiles;
    }

    if (!target || target === 'documents') {
      updateData.documents = nextDocuments;
    }

    if (!target || target === 'anamnesesMedicationPlan') {
      updateData.anamneses = nextAnamneses;
    }

    await prisma.memberProfile.update({
      where: { id: memberId },
      data: updateData,
    });

    let storageDeletion: 'deleted' | 'skipped' | 'failed' = 'skipped';

    if (hasManagedStorageReference(fileReference, memberId)) {
      try {
        const key = toObjectKey(fileReference);
        const resolvedVisibility =
          resolveS3BucketVisibilityFromUrlOrPath(fileReference);
        await deleteS3ObjectByKey(key, resolvedVisibility ?? 'private');
        storageDeletion = 'deleted';
      } catch {
        storageDeletion = 'failed';
      }
    }

    return NextResponse.json(
      {
        message: 'Member file deleted',
        removedCount,
        storageDeletion,
      },
      { status: 200 },
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error deleting member file:', error);
    }

    return NextResponse.json(
      { error: 'Failed to delete member file' },
      { status: 500 },
    );
  }
}
