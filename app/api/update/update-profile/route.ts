import prisma from '@/lib/db';
import { Certificate, Schedule } from '@/utils/types';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body.id || !body.data) {
      return NextResponse.json(
        { message: 'User ID and data are required' },
        { status: 400 }
      );
    }

    const certificates: Certificate[] = body.data.certificates || [];
    const locations = body.data.locations || [];

    const dbUser = await prisma.user.findUnique({
      where: { id: body.id },
      include: { certificates: true, locations: true },
    });

    const dbCertIds =
      dbUser?.certificates.map((certificate) => certificate.id) || [];
    const incomingCertIds = certificates
      .filter((certificate) => certificate.id)
      .map((c) => c.id);
    const certsToDelete = dbCertIds.filter(
      (id) => !incomingCertIds.includes(id)
    );
    const newCertificates = certificates.filter(
      (certificate) => !dbCertIds.includes(certificate.id)
    );
    const existingCertificates = certificates.filter((certificate) =>
      dbCertIds.includes(certificate.id)
    );

    const dbLocationIds =
      dbUser?.locations.map((location) => location.id) || [];
    const incomingLocationIds = locations
      .filter((location: { id: string }) => location.id)
      .map((locationItem: { id: string }) => locationItem.id);
    const locationsToDelete = dbLocationIds.filter(
      (id) => !incomingLocationIds.includes(id)
    );
    const newLocations = locations.filter(
      (location: { id: string }) => !dbLocationIds.includes(location.id)
    );
    const existingLocations = locations.filter((location: { id: string }) =>
      dbLocationIds.includes(location.id)
    );

    const sanitizedReservationLinks = Array.isArray(body.data.reservationLinks)
      ? body.data.reservationLinks.filter(
          (linkItem: { url?: string }) =>
            typeof linkItem?.url === 'string' && linkItem.url.trim().length > 0
        )
      : undefined;

    const updateUser = await prisma.user.update({
      where: { id: body.id },
      data: {
        ...body.data,
        ...(sanitizedReservationLinks !== undefined && {
          reservationLinks: sanitizedReservationLinks,
        }),
        certificates: {
          ...(certsToDelete.length > 0 && {
            deleteMany: certsToDelete.map((id) => ({ id })),
          }),
          ...(existingCertificates.length > 0 && {
            update: existingCertificates.map((cert) => ({
              where: { id: cert.id },
              data: {
                name: cert.name,
                issuer: cert.issuer,
                issueDate: cert.issueDate,
                expiryDate: cert.expiryDate,
                credentialId: cert.credentialId,
                credentialUrl: cert.credentialUrl,
                images: cert.images,
              },
            })),
          }),
          ...(newCertificates.length > 0 && {
            create: newCertificates.map((cert) => ({
              name: cert.name,
              issuer: cert.issuer,
              issueDate: cert.issueDate,
              expiryDate: cert.expiryDate,
              credentialId: cert.credentialId,
              credentialUrl: cert.credentialUrl,
              images: cert.images,
            })),
          }),
        },
        locations: {
          ...(locationsToDelete.length > 0 && {
            deleteMany: locationsToDelete.map((id) => ({ id })),
          }),
          ...(existingLocations.length > 0 && {
            update: existingLocations.map(
              (location: {
                id: string;
                address: string;
                phone: string | string[];
                schedule: Schedule[];
                reservationLinks?: unknown;
              }) => {
                const locLinks = Array.isArray(location.reservationLinks)
                  ? (location.reservationLinks as Array<{ url?: string }>)
                  : undefined;
                return {
                  where: { id: location.id },
                  data: {
                    address: location.address,
                    phone: (Array.isArray(location.phone)
                      ? location.phone
                      : [location.phone]
                    ).filter(Boolean),
                    schedule: Array.isArray(location.schedule)
                      ? location.schedule
                      : [],
                    ...(locLinks && {
                      reservationLinks: locLinks.filter(
                        (reservationLink) =>
                          typeof reservationLink?.url === 'string' &&
                          (reservationLink.url as string).trim().length > 0
                      ),
                    }),
                  },
                };
              }
            ),
          }),
          ...(newLocations.length > 0 && {
            create: newLocations.map(
              (location: {
                address: string;
                phone: string | string[];
                schedule: Schedule[];
                reservationLinks?: unknown;
              }) => {
                const locLinks = Array.isArray(location.reservationLinks)
                  ? (location.reservationLinks as Array<{ url?: string }>)
                  : undefined;
                return {
                  address: location.address,
                  phone: (Array.isArray(location.phone)
                    ? location.phone
                    : [location.phone]
                  ).filter(Boolean),
                  schedule: Array.isArray(location.schedule)
                    ? location.schedule
                    : [],
                  ...(locLinks && {
                    reservationLinks: locLinks.filter(
                      (reservationLink) =>
                        typeof reservationLink?.url === 'string' &&
                        (reservationLink.url as string).trim().length > 0
                    ),
                  }),
                };
              }
            ),
          }),
        },
      },
      include: { certificates: true, locations: true },
    });

    revalidatePath(`/profile/${body.id}`);
    revalidatePath(`/dashboard/edit-profile/${body.id}`);

    return NextResponse.json({
      message: 'Profile updated successfully',
      data: updateUser,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: 'Failed to update profile',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
