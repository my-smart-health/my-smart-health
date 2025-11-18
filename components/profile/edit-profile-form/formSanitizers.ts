import { serializeSocials } from '@/utils/common';
import {
  CertificateForm,
  FieldOfExpertise,
  Location,
  ReservationLink,
  Schedule,
  Social,
} from '@/utils/types';

export type ProfileUpdatePayload = {
  name: string;
  bio: string;
  fieldOfExpertise: FieldOfExpertise[];
  displayEmail: string;
  website: string;
  profileImages: string[];
  profileFiles: string[];
  socials: string[];
  phones: string[];
  schedule: Schedule[];
  reservationLinks: ReservationLink[];
  certificates: Array<{
    id?: string;
    name: string;
    issuer: string;
    images: string[];
    issueDate: string;
    expiryDate: string | null;
    credentialId: string | null;
    credentialUrl: string | null;
  }>;
  locations: Array<{
    id: string;
    address: string;
    phone: string[];
    schedule: Schedule[];
    reservationLinks: ReservationLink[];
  }>;
};

export type BuildSanitizedPayloadArgs = {
  name: string;
  bio: string;
  displayEmail: string;
  website: string;
  profileImages: string[];
  profileFiles: string[] | null;
  fieldOfExpertise: FieldOfExpertise[] | null;
  phones: string[] | null;
  socials: Social[] | null;
  schedule: Schedule[] | null;
  certificates: CertificateForm[] | null;
  reservationLinks: ReservationLink[] | null;
  locations: Location[] | null;
  profileImagesOverride?: string[];
  profileFilesOverride?: string[];
};

export const sanitizePhoneList = (numbers?: string[] | null): string[] => {
  if (!Array.isArray(numbers)) return [];
  return numbers
    .map((number) => (typeof number === 'string' ? number.trim() : ''))
    .filter((number): number is string => number.length > 0);
};

export const sanitizeFieldOfExpertiseList = (
  items?: FieldOfExpertise[] | null
): FieldOfExpertise[] => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => ({
      ...item,
      label: (item.label || '').trim(),
      description: (item.description || '').trim(),
    }))
    .filter((item) => item.label.length > 0);
};

export const sanitizeSocialList = (items?: Social[] | null): Social[] => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => ({
      platform: (item.platform || '').trim(),
      url: (item.url || '').trim(),
    }))
    .filter((item) => item.platform.length > 0 && item.url.length > 0);
};

export const sanitizeReservationLinks = (
  links?: ReservationLink[] | null
): ReservationLink[] => {
  if (!Array.isArray(links)) return [];
  return links
    .map((link) => ({
      ...link,
      url: (link.url || '').trim(),
    }))
    .filter((link) => link.url.length > 0);
};

export const normalizeScheduleDay = (
  day?: Schedule['day']
): Schedule['day'] => ({
  Monday: Boolean(day?.Monday),
  Tuesday: Boolean(day?.Tuesday),
  Wednesday: Boolean(day?.Wednesday),
  Thursday: Boolean(day?.Thursday),
  Friday: Boolean(day?.Friday),
  Saturday: Boolean(day?.Saturday),
  Sunday: Boolean(day?.Sunday),
});

export const sanitizeScheduleList = (
  entries?: Schedule[] | null
): Schedule[] => {
  if (!Array.isArray(entries)) return [];
  return entries
    .map((entry) => {
      const title = (entry.title || '').trim();
      const open = (entry.open || '').trim();
      const close = (entry.close || '').trim();
      const day = normalizeScheduleDay(entry.day);
      return {
        ...entry,
        title,
        open,
        close,
        day,
      };
    })
    .filter((entry) => {
      const hasDaySelection = Object.values(entry.day).some(Boolean);
      const hasTimes = entry.open.length > 0 || entry.close.length > 0;
      const hasTitle = (entry.title || '').length > 0;
      return hasDaySelection || hasTimes || hasTitle;
    });
};

export const sanitizeCertificateForms = (
  certificates?: CertificateForm[] | null
): CertificateForm[] => {
  if (!Array.isArray(certificates)) return [];

  const sanitized: CertificateForm[] = [];

  certificates.forEach((certificate) => {
    const name = (certificate.name || '').trim();
    const issuer = (certificate.issuer || '').trim();
    const images = Array.isArray(certificate.images)
      ? certificate.images.filter(Boolean)
      : [];
    const credentialIdRaw =
      certificate.credentialId !== undefined &&
      certificate.credentialId !== null
        ? String(certificate.credentialId).trim()
        : '';
    const credentialUrlRaw = (certificate.credentialUrl || '').trim();
    const issueDateValue = certificate.issueDate
      ? new Date(certificate.issueDate)
      : null;
    const expiryDateValue = certificate.expiryDate
      ? new Date(certificate.expiryDate)
      : null;

    const hasAnyContent =
      name ||
      issuer ||
      images.length > 0 ||
      credentialIdRaw ||
      credentialUrlRaw;

    if (!hasAnyContent) {
      return;
    }

    if (!name || !issuer) {
      return;
    }

    if (!issueDateValue || Number.isNaN(issueDateValue.getTime())) {
      return;
    }

    sanitized.push({
      ...certificate,
      name,
      issuer,
      images,
      credentialId: credentialIdRaw.length > 0 ? credentialIdRaw : null,
      credentialUrl: credentialUrlRaw.length > 0 ? credentialUrlRaw : null,
      issueDate: issueDateValue,
      expiryDate:
        expiryDateValue && !Number.isNaN(expiryDateValue.getTime())
          ? expiryDateValue
          : null,
    });
  });

  return sanitized;
};

export const sanitizeProfileImages = (images?: string[] | null): string[] => {
  if (!Array.isArray(images)) return [];
  return images
    .map((url) => (typeof url === 'string' ? url.trim() : ''))
    .filter((url): url is string => url.length > 0);
};

export const sanitizeProfileFiles = (files?: string[] | null): string[] => {
  if (!Array.isArray(files)) return [];
  return files
    .map((url) => (typeof url === 'string' ? url.trim() : ''))
    .filter((url): url is string => url.length > 0);
};

export const sanitizeLocationsList = (
  locations?: Location[] | null
): Location[] => {
  if (!Array.isArray(locations)) return [];
  const sanitized: Location[] = [];

  locations.forEach((location) => {
    const addressParts = Array.isArray(location.address)
      ? location.address
      : [location.address || ''];
    const address = addressParts
      .map((part) => (typeof part === 'string' ? part.trim() : ''))
      .filter((part) => part.length > 0)
      .join(', ');

    const phoneArray = Array.isArray(location.phone)
      ? location.phone
      : [location.phone || ''];
    const phone = sanitizePhoneList(phoneArray);

    const schedule = sanitizeScheduleList(location.schedule);
    const reservationLinks = sanitizeReservationLinks(
      Array.isArray(location.reservationLinks)
        ? (location.reservationLinks as ReservationLink[])
        : []
    );

    const hasContent =
      address.length > 0 ||
      phone.length > 0 ||
      schedule.length > 0 ||
      reservationLinks.length > 0;

    if (!hasContent) {
      return;
    }

    sanitized.push({
      ...location,
      address,
      phone,
      schedule,
      reservationLinks,
    });
  });

  return sanitized;
};

export const buildSanitizedPayload = (
  args: BuildSanitizedPayloadArgs
): ProfileUpdatePayload => {
  const sanitizedFieldOfExpertise = sanitizeFieldOfExpertiseList(
    args.fieldOfExpertise
  );
  const sanitizedPhones = sanitizePhoneList(args.phones);
  const sanitizedSocials = sanitizeSocialList(args.socials);
  const sanitizedSchedule = sanitizeScheduleList(args.schedule);
  const sanitizedCertificates = sanitizeCertificateForms(args.certificates);
  const sanitizedReservationLinks = sanitizeReservationLinks(
    args.reservationLinks
  );
  const sanitizedLocations = sanitizeLocationsList(args.locations);
  const sanitizedProfileImages = sanitizeProfileImages(
    args.profileImagesOverride ?? args.profileImages
  );
  const sanitizedProfileFiles = sanitizeProfileFiles(
    args.profileFilesOverride ?? args.profileFiles
  );

  return {
    name: (args.name || '').trim(),
    bio: args.bio,
    displayEmail: (args.displayEmail || '').trim(),
    website: (args.website || '').trim(),
    fieldOfExpertise: sanitizedFieldOfExpertise,
    phones: sanitizedPhones,
    socials: serializeSocials(sanitizedSocials),
    schedule: sanitizedSchedule,
    certificates: sanitizedCertificates.map((certificate) => ({
      id: certificate.id,
      name: certificate.name,
      issuer: certificate.issuer,
      images: Array.isArray(certificate.images) ? certificate.images : [],
      issueDate:
        certificate.issueDate instanceof Date
          ? certificate.issueDate.toISOString()
          : new Date(certificate.issueDate).toISOString(),
      expiryDate:
        certificate.expiryDate instanceof Date
          ? certificate.expiryDate.toISOString()
          : certificate.expiryDate
          ? new Date(certificate.expiryDate).toISOString()
          : null,
      credentialId:
        certificate.credentialId !== undefined &&
        certificate.credentialId !== null
          ? certificate.credentialId
          : null,
      credentialUrl: certificate.credentialUrl || null,
    })),
    reservationLinks: sanitizedReservationLinks,
    locations: sanitizedLocations.map((location) => ({
      id: location.id,
      address: location.address,
      phone: Array.isArray(location.phone)
        ? location.phone
        : sanitizePhoneList([location.phone]),
      schedule: Array.isArray(location.schedule) ? location.schedule : [],
      reservationLinks: Array.isArray(location.reservationLinks)
        ? sanitizeReservationLinks(
            location.reservationLinks as ReservationLink[]
          )
        : [],
    })),
    profileImages: sanitizedProfileImages,
    profileFiles: sanitizedProfileFiles,
  };
};
