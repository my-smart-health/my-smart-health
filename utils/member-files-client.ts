export type MemberFileTarget =
  | 'bloodTypeFiles'
  | 'documents'
  | 'anamnesesMedicationPlan';

type UploadMemberFileArgs = {
  memberId: string;
  target: MemberFileTarget;
  file: File;
  folder?: string;
  description?: string;
  anamnesisIndex?: number;
  medicationIndex?: number;
};

type DeleteMemberFileArgs = {
  memberId: string;
  fileUrl: string;
  target?: MemberFileTarget;
  anamnesisIndex?: number;
  medicationIndex?: number;
};

const appendOptionalNumber = (
  params: URLSearchParams,
  key: string,
  value?: number,
) => {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0) {
    params.set(key, String(value));
  }
};

export const uploadMemberFile = async ({
  memberId,
  target,
  file,
  folder,
  description,
  anamnesisIndex,
  medicationIndex,
}: UploadMemberFileArgs) => {
  const params = new URLSearchParams({
    memberId,
    target,
    filename: file.name,
  });

  if (folder) {
    params.set('folder', folder);
  }

  if (description && description.trim()) {
    params.set('description', description.trim());
  }

  appendOptionalNumber(params, 'anamnesisIndex', anamnesisIndex);
  appendOptionalNumber(params, 'medicationIndex', medicationIndex);

  const response = await fetch(
    `/api/member/files/upload?${params.toString()}`,
    {
      method: 'PUT',
      body: file,
    },
  );

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error || 'Failed to upload file');
  }

  return payload as {
    message: string;
    target: MemberFileTarget;
    file: { url: string; description?: string };
  };
};

export const deleteMemberFile = async ({
  memberId,
  fileUrl,
  target,
  anamnesisIndex,
  medicationIndex,
}: DeleteMemberFileArgs) => {
  const params = new URLSearchParams({
    memberId,
    fileUrl,
  });

  if (target) {
    params.set('target', target);
  }

  appendOptionalNumber(params, 'anamnesisIndex', anamnesisIndex);
  appendOptionalNumber(params, 'medicationIndex', medicationIndex);

  const response = await fetch(
    `/api/member/files/delete?${params.toString()}`,
    {
      method: 'DELETE',
    },
  );

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error || 'Failed to delete file');
  }

  return payload;
};

export const getMemberFileDownloadUrl = (
  memberId: string,
  fileUrl: string,
  expiresIn = 300,
) => {
  const params = new URLSearchParams({
    memberId,
    fileUrl,
    expiresIn: String(expiresIn),
    download: '1',
    redirect: '1',
  });

  return `/api/member/files/view?${params.toString()}`;
};
