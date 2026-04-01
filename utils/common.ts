import {
  Anamneses,
  ErrorState,
  Locale,
  Social,
  MedicationPlanTable,
  HospitalStays,
  FileWithDescription,
  TelMedicinePhoneNumber,
} from './types';

export function resolveLocale(request: Request | { headers: Headers }): Locale {
  const requested = request.headers.get('accept-language')?.toLowerCase() ?? '';
  return requested.startsWith('de') ? 'de' : 'en';
}

export function parseSocials(socials: string[]): Social[] {
  return socials
    .map((s) => {
      const [platform, url] = s.split('|');
      return { platform, url };
    })
    .filter((s) => s.platform && s.url);
}

export function serializeSocials(socials: Social[]): string[] {
  return socials
    .filter((s) => s.platform && s.url)
    .map((s) => `${s.platform}|${s.url}`);
}

export function safeCategory(category: string) {
  return category.replace(/\s+/g, '-').replace(/%26/g, '&');
}

export function unsafeCategory(category: string) {
  return category.replace(/-/g, ' ').replace(/%26/g, '&');
}

export function isYoutubeLink(item: string) {
  const isYoutube = /youtu(be)?/.test(item);
  return isYoutube;
}

export function isInstagramLink(item: string) {
  const isInstagram = /instagram/.test(item);
  return isInstagram;
}

export function getModalColor(
  error: ErrorState | null,
  isDefaultLogo: boolean,
) {
  if (!error) return '';
  if (error.type === 'success')
    return isDefaultLogo ? 'bg-yellow-500' : 'bg-green-500';
  if (error.type === 'warning') return 'bg-yellow-500';
  return 'bg-red-500';
}

export function isBlobUrl(url: string) {
  return url.startsWith(process.env.BLOB_URL_PREFIX || '');
}

export function getFileNameFromUrl(fileUrl: string) {
  const stripGeneratedSuffix = (filename: string) =>
    filename.replace(
      /-[a-f0-9]{12}(\.[^.]+)?$/i,
      (_match, extension = '') => extension,
    );

  try {
    const url = new URL(fileUrl);
    url.searchParams.delete('download');
    const parts = url.pathname.split('/');
    const fileName = decodeURIComponent(parts.pop() || fileUrl);
    return stripGeneratedSuffix(fileName);
  } catch {
    const stripped = fileUrl.split(/[?#]/)[0];
    const fileName = stripped.replace(/^.*[\\/]/, '') || fileUrl;
    return stripGeneratedSuffix(fileName);
  }
}

export function cleanupHealthInsurances(
  healthInsurances: {
    provider: string;
    insuranceName: string;
    insuranceNumber: string;
    phone: string;
  }[],
) {
  return healthInsurances.filter(
    (item) =>
      item.provider?.trim() ||
      item.insuranceName?.trim() ||
      item.insuranceNumber?.trim() ||
      item.phone?.trim(),
  );
}

export function cleanupMedicationPlan(
  medicationPlan: {
    name: string;
    dateOfIssue: string;
    fileUrl: { url: string; description?: string }[];
  }[],
) {
  return medicationPlan
    .map((item) => ({
      ...item,
      fileUrl: item.fileUrl
        ? item.fileUrl
            .map((file) => ({
              url: file.url?.trim() || '',
              description: file.description?.trim() || undefined,
            }))
            .filter((file) => file.url)
        : [],
    }))
    .filter(
      (item) =>
        item.name?.trim() ||
        item.dateOfIssue?.trim() ||
        (item.fileUrl && item.fileUrl.length > 0),
    );
}

export function cleanupAllergies(
  allergies: { name: string; severity: string }[],
) {
  return allergies.filter((item) => item.name?.trim() || item.severity?.trim());
}

export function cleanupIntolerances(
  intolerances: { name: string; severity: string }[],
) {
  return intolerances.filter(
    (item) => item.name?.trim() || item.severity?.trim(),
  );
}

export function cleanupDoctors(
  doctors: {
    name: string;
    specialty: string;
    emails?: string[];
    phones?: string[];
  }[],
) {
  return doctors
    .map((item) => ({
      ...item,
      emails: item.emails ? item.emails.filter((email) => email?.trim()) : [],
      phones: item.phones ? item.phones.filter((phone) => phone?.trim()) : [],
    }))
    .filter(
      (item) =>
        item.name?.trim() ||
        item.specialty?.trim() ||
        (item.emails && item.emails.length > 0) ||
        (item.phones && item.phones.length > 0),
    );
}

export function cleanupAnamneses(anamneses: Anamneses[]) {
  return anamneses
    .map((item) => {
      const medicationPlanTable = item.medicationPlan?.medicationPlanTable
        ? item.medicationPlan.medicationPlanTable
            .map((med: MedicationPlanTable) => ({
              medication: med.medication?.trim() || '',
              dosage: med.dosage?.trim() || '',
              sinceWhen: med.sinceWhen?.trim() || '',
              reason: med.reason?.trim() || '',
              fileUrl: med.fileUrl
                ? med.fileUrl
                    .map((file: FileWithDescription) => ({
                      url: file.url?.trim() || '',
                      description: file.description?.trim() || undefined,
                    }))
                    .filter((file: FileWithDescription) => {
                      const url = file.url;
                      return (
                        url &&
                        url.length > 0 &&
                        url !== 'File' &&
                        url !== 'file'
                      );
                    })
                : null,
            }))
            .filter(
              (med) =>
                med.medication ||
                med.dosage ||
                med.sinceWhen ||
                med.reason ||
                (med.fileUrl && med.fileUrl.length > 0),
            )
        : [];

      const hospitalStays = item.hospitalStays
        ? item.hospitalStays
            .map((stay: HospitalStays) => ({
              year: stay.year,
              treatment: stay.treatment?.trim() || '',
              hospital: stay.hospital?.trim() || '',
            }))
            .filter((stay) => stay.year || stay.treatment || stay.hospital)
        : [];

      return {
        text: item.text?.trim() || '',
        illnesses: item.illnesses || {},
        hospitalStays,
        medicationPlan: {
          medicationPlanTable,
          noRegularMedications:
            item.medicationPlan?.noRegularMedications ?? null,
        },
        allergiesIntolerances: item.allergiesIntolerances || {},
        familyHistoryOfIllnesses: item.familyHistoryOfIllnesses || {},
        lifestyle: item.lifestyle || {},
        vaccinationStatus: item.vaccinationStatus || {},
      };
    })
    .filter(
      (item) =>
        item.text ||
        item.hospitalStays.length > 0 ||
        item.medicationPlan.medicationPlanTable.length > 0 ||
        item.medicationPlan.noRegularMedications !== null ||
        Object.values(item.illnesses).some((v) => v !== null) ||
        Object.values(item.allergiesIntolerances).some((v) => v !== null) ||
        Object.values(item.familyHistoryOfIllnesses).some((v) => v !== null) ||
        Object.values(item.vaccinationStatus).some((v) => v !== null),
    );
}

export function cleanupFamilyMembers(
  familyMembers: { name: string; phones: string[] }[],
) {
  return familyMembers
    .map((item) => ({
      name: item.name,
      phones: item.phones ? item.phones.filter((phone) => phone?.trim()) : [],
    }))
    .filter(
      (item) => item.name?.trim() || (item.phones && item.phones.length > 0),
    );
}

export function cleanupBloodType(bloodType: string): string | null {
  const trimmed = bloodType?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

export function cleanupBloodTypeFiles(
  files: { url: string; description?: string }[],
): { url: string; description?: string }[] {
  return files
    .map((file) => ({
      url: file.url?.trim() || '',
      description: file.description?.trim() || undefined,
    }))
    .filter((file) => {
      const url = file.url;
      return url && url.length > 0 && url !== 'File' && url !== 'file';
    });
}

export function cleanupDocuments(
  documents: { url: string; description?: string }[],
) {
  return documents
    .map((item) => ({
      url: item.url?.trim() || '',
      description: item.description?.trim() || undefined,
    }))
    .filter((item) => {
      const url = item.url;
      return url && url.length > 0 && url !== 'File' && url !== 'file';
    });
}

export function cleanupSpecialNumbers(
  specialNumbers: TelMedicinePhoneNumber[],
) {
  return specialNumbers
    .map((item) => ({
      type: item.type?.trim() || '',
      phone: item.phone?.trim() || '',
      description: item.description?.trim() || undefined,
    }))
    .filter((item) => item.type || item.phone || item.description);
}
