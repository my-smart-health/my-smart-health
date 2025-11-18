import {
  FieldOfExpertise,
  Schedule,
  Location,
  Certificate,
  ReservationLink,
} from './types';

type RawUser = any;

function ensureArray<T>(v: unknown): T[] {
  if (!v) return [];
  if (Array.isArray(v)) return v as T[];
  if (typeof v === 'string') {
    try {
      return JSON.parse(v) as T[];
    } catch {
      return [v as unknown as T];
    }
  }
  return [v as unknown as T];
}

function normalizeFieldOfExpertise(v: unknown): FieldOfExpertise[] {
  const arr = ensureArray<FieldOfExpertise>(v);
  return arr.map((item) => {
    if (!item || typeof item === 'string') {
      try {
        const parsed = typeof item === 'string' ? JSON.parse(item) : item;
        return {
          id: parsed?.id ?? crypto.randomUUID(),
          label: parsed?.label ?? String(parsed),
          description: parsed?.description ?? '',
        };
      } catch {
        return {
          id: crypto.randomUUID(),
          label: String(item),
          description: '',
        };
      }
    }
    return {
      id:
        item.id ??
        (item.label
          ? item.label.replace(/\s+/g, '-').toLowerCase()
          : crypto.randomUUID()),
      label: (item as any).label ?? String(item),
      description: (item as any).description ?? '',
    };
  });
}

function normalizeScheduleArray(v: unknown): Schedule[] {
  const arr = ensureArray<Schedule>(v);
  return arr.map((sch) => {
    const base =
      typeof sch === 'string'
        ? (() => {
            try {
              return JSON.parse(sch);
            } catch {
              return { id: crypto.randomUUID(), day: {}, open: '', close: '' };
            }
          })()
        : sch || {};
    const day = {
      Monday: Boolean(base.day?.Monday),
      Tuesday: Boolean(base.day?.Tuesday),
      Wednesday: Boolean(base.day?.Wednesday),
      Thursday: Boolean(base.day?.Thursday),
      Friday: Boolean(base.day?.Friday),
      Saturday: Boolean(base.day?.Saturday),
      Sunday: Boolean(base.day?.Sunday),
    };
    const open = typeof base.open === 'string' ? base.open : '';
    const close = typeof base.close === 'string' ? base.close : '';
    const id = base.id ?? crypto.randomUUID();
    const title = base.title ?? '';
    return { id, title, day, open, close };
  });
}

export function normalizeUser(raw: RawUser) {
  if (!raw) {
    return {
      id: '',
      name: 'Unknown',
      profileImages: [] as string[],
      profileFiles: [] as string[],
      bio: '',
      socials: [] as string[],
      fieldOfExpertise: [] as FieldOfExpertise[],
      website: null,
      displayEmail: null,
      phones: [] as string[],
      locations: [] as Location[],
      schedule: [] as Schedule[],
      certificates: [] as Certificate[],
      reservationLinks: [] as ReservationLink[],
    };
  }

  const profileImages = ensureArray<string>(raw.profileImages);
  const socials = ensureArray<string>(raw.socials);
  const fieldOfExpertise = normalizeFieldOfExpertise(raw.fieldOfExpertise);
  const locations = ensureArray<Location>(raw.locations).map(
    (locationRecord) => {
      const locationData = locationRecord as unknown as Record<string, unknown>;
      const schedule = normalizeScheduleArray(locationData.schedule ?? []);
      const reservationLinks: ReservationLink[] = Array.isArray(
        locationData.reservationLinks
      )
        ? (locationData.reservationLinks as ReservationLink[])
        : [];
      return {
        ...(locationRecord as object),
        schedule,
        reservationLinks,
      } as Location;
    }
  );

  return {
    id: raw.id ?? '',
    name: raw.name ?? null,
    email: raw.email ?? null,
    profileImages,
    profileFiles: ensureArray<string>(raw.profileFiles),
    bio: raw.bio ?? '',
    socials,
    website: raw.website ?? null,
    fieldOfExpertise,
    displayEmail: raw.displayEmail ?? null,
    phones: ensureArray<string>(raw.phones),
    locations,
    schedule: normalizeScheduleArray(raw.schedule ?? []),
    certificates: ensureArray<Certificate>(raw.certificates),
    reservationLinks: ensureArray<ReservationLink>(raw.reservationLinks),
  };
}
