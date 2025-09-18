import prisma from '@/lib/db';
import { Certificate } from '@/utils/types';
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

    const dbUser = await prisma.user.findUnique({
      where: { id: body.id },
      include: { certificates: true },
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
      },
      include: { certificates: true },
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
