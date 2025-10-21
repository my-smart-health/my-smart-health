import prisma from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const location = await prisma.mySmartHealthLocation.findUnique({
      where: { id },
    });

    if (!location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(location);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching MSH location:', error);
    }
    return NextResponse.json(
      { error: 'Failed to fetch location' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { address, phone, schedule } = body;

    const updated = await prisma.mySmartHealthLocation.update({
      where: { id },
      data: {
        ...(address !== undefined && { address }),
        ...(phone !== undefined && { phone }),
        ...(schedule !== undefined && { schedule }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error updating MSH location:', error);
    }
    return NextResponse.json(
      { error: 'Failed to update location' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    await prisma.mySmartHealthLocation.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Location deleted successfully' });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error deleting MSH location:', error);
    }
    return NextResponse.json(
      { error: 'Failed to delete location' },
      { status: 500 }
    );
  }
}
