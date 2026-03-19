import prisma from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import {
  deleteS3ObjectByKey,
  extractS3KeyFromUrlOrPath,
  uploadRequestToS3,
} from '@/lib/s3-storage';
import {
  MAX_PROFILE_FILE_SIZE_BYTES,
  MAX_PROFILE_FILE_SIZE_MB,
} from '@/utils/constants';

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

const createDefaultMedicationPlanEntry = (): MedicationPlanEntry => ({
  medication: '',
  dosage: '',
  sinceWhen: '',
  reason: '',
  fileUrl: [],
});

const createDefaultAnamnesisEntry = (): AnamnesisEntry => ({
  text: '',
  medicationPlan: {
    medicationPlanTable: [],
    noRegularMedications: null,
  },
});

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

const sanitizeFolderSegment = (value: string) =>
  value
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/');

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

const getDefaultFolderByTarget = (target: MemberFileTarget) => {
  if (target === 'bloodTypeFiles') {
    return 'blood-type-files';
  }

  if (target === 'documents') {
    return 'documents';
  }

  return 'anamneses/medicationplan';
};

export async function PUT(request: Request) {
  let uploadedObjectKey: string | null = null;

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');
    const filename = searchParams.get('filename');
    const target = searchParams.get('target') as MemberFileTarget | null;
    const folder = searchParams.get('folder');
    const description = searchParams.get('description') ?? undefined;

    const anamnesisIndex = parseIndex(searchParams.get('anamnesisIndex'));
    const medicationIndex = parseIndex(searchParams.get('medicationIndex'));

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 },
      );
    }

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 },
      );
    }

    if (!target || !MEMBER_FILE_TARGETS.includes(target)) {
      return NextResponse.json(
        {
          error:
            'Target is required and must be one of: bloodTypeFiles, documents, anamnesesMedicationPlan',
        },
        { status: 400 },
      );
    }

    if (memberId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!request.body) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const contentLength = request.headers.get('content-length');
    if (
      contentLength &&
      parseInt(contentLength, 10) > MAX_PROFILE_FILE_SIZE_BYTES
    ) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_PROFILE_FILE_SIZE_MB}MB limit` },
        { status: 413 },
      );
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

    let currentAnamneses: AnamnesisEntry[] = [];
    let selectedAnamnesis: AnamnesisEntry | null = null;
    let medicationPlanTable: unknown[] = [];

    if (target === 'anamnesesMedicationPlan') {
      if (anamnesisIndex === null || medicationIndex === null) {
        return NextResponse.json(
          {
            error:
              'anamnesisIndex and medicationIndex are required for anamnesesMedicationPlan target',
          },
          { status: 400 },
        );
      }

      currentAnamneses = toAnamnesesArray(member.anamneses);

      while (currentAnamneses.length <= anamnesisIndex) {
        currentAnamneses.push(createDefaultAnamnesisEntry());
      }

      selectedAnamnesis =
        currentAnamneses[anamnesisIndex] || createDefaultAnamnesisEntry();
      medicationPlanTable = Array.isArray(
        selectedAnamnesis.medicationPlan?.medicationPlanTable,
      )
        ? [
            ...(selectedAnamnesis.medicationPlan
              ?.medicationPlanTable as unknown[]),
          ]
        : [];

      while (medicationPlanTable.length <= medicationIndex) {
        medicationPlanTable.push(createDefaultMedicationPlanEntry());
      }
    }

    const safeFolder = sanitizeFolderSegment(
      folder || getDefaultFolderByTarget(target),
    );
    const storagePath = `${memberId}/${safeFolder}/${filename}`;

    const uploadedFile = await uploadRequestToS3({
      request,
      key: storagePath,
      addRandomSuffix: true,
      visibility: 'private',
    });

    uploadedObjectKey = extractS3KeyFromUrlOrPath(uploadedFile.pathname);

    const savedFile: FileWithDescription = {
      url: uploadedObjectKey,
      description,
    };

    if (target === 'bloodTypeFiles') {
      const updatedFiles = [...toFileArray(member.bloodTypeFiles), savedFile];

      await prisma.memberProfile.update({
        where: { id: memberId },
        data: {
          bloodTypeFiles: updatedFiles,
        },
      });

      return NextResponse.json(
        {
          message: 'Member file uploaded and saved',
          target,
          file: savedFile,
        },
        { status: 200 },
      );
    }

    if (target === 'documents') {
      const updatedFiles = [...toFileArray(member.documents), savedFile];

      await prisma.memberProfile.update({
        where: { id: memberId },
        data: {
          documents: updatedFiles,
        },
      });

      return NextResponse.json(
        {
          message: 'Member file uploaded and saved',
          target,
          file: savedFile,
        },
        { status: 200 },
      );
    }

    const selectedMedication = {
      ...(medicationPlanTable[
        medicationIndex as number
      ] as MedicationPlanEntry),
    };

    selectedMedication.fileUrl = [
      ...toFileArray(selectedMedication.fileUrl),
      savedFile,
    ];

    medicationPlanTable[medicationIndex as number] = selectedMedication;

    const updatedAnamneses = [...currentAnamneses];
    updatedAnamneses[anamnesisIndex as number] = {
      ...(selectedAnamnesis as AnamnesisEntry),
      medicationPlan: {
        ...((selectedAnamnesis as AnamnesisEntry).medicationPlan || {}),
        medicationPlanTable,
      },
    };

    await prisma.memberProfile.update({
      where: { id: memberId },
      data: {
        anamneses: updatedAnamneses,
      },
    });

    return NextResponse.json(
      {
        message: 'Member file uploaded and saved',
        target,
        file: savedFile,
      },
      { status: 200 },
    );
  } catch (error) {
    if (uploadedObjectKey) {
      try {
        await deleteS3ObjectByKey(uploadedObjectKey, 'private');
      } catch {}
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('Error uploading member file:', error);
    }

    return NextResponse.json(
      { error: 'Failed to upload member file' },
      { status: 500 },
    );
  }
}
