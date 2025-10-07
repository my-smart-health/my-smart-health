import prisma from '@/lib/db';
import { Certificate, Schedule } from '@/utils/types';
import { NextResponse } from 'next/server';

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

    const dbCertIds = dbUser?.certificates.map((c) => c.id) || [];
    const incomingCertIds = certificates.filter((c) => c.id).map((c) => c.id);
    const certsToDelete = dbCertIds.filter(
      (id) => !incomingCertIds.includes(id)
    );
    const newCertificates = certificates.filter(
      (c) => !dbCertIds.includes(c.id)
    );
    const existingCertificates = certificates.filter((c) =>
      dbCertIds.includes(c.id)
    );

    const dbLocationIds = dbUser?.locations.map((l) => l.id) || [];
    const incomingLocationIds = locations
      .filter((l: { id: string }) => l.id)
      .map((l: { id: string }) => l.id);
    const locationsToDelete = dbLocationIds.filter(
      (id) => !incomingLocationIds.includes(id)
    );
    const newLocations = locations.filter(
      (l: { id: string }) => !dbLocationIds.includes(l.id)
    );
    const existingLocations = locations.filter((l: { id: string }) =>
      dbLocationIds.includes(l.id)
    );

    const updateUser = await prisma.user.update({
      where: { id: body.id },
      data: {
        ...body.data,
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
              (loc: {
                id: string;
                address: string;
                phone: string;
                schedule: Schedule[];
              }) => ({
                where: { id: loc.id },
                data: {
                  address: loc.address,
                  phone: loc.phone,
                  schedule: Array.isArray(loc.schedule) ? loc.schedule : [],
                },
              })
            ),
          }),
          ...(newLocations.length > 0 && {
            create: newLocations.map(
              (loc: {
                address: string;
                phone: string;
                schedule: Schedule[];
              }) => ({
                address: loc.address,
                phone: loc.phone,
                schedule: Array.isArray(loc.schedule) ? loc.schedule : [],
              })
            ),
          }),
        },
      },
      include: { certificates: true, locations: true },
    });

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
