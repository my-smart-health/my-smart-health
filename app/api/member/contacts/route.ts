import prisma from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get('memberId');

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID required' },
        { status: 400 },
      );
    }

    if (session.user.role !== 'ADMIN' && session.user.id !== memberId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const memberContacts = await prisma.memberDoctor.findMany({
      where: { memberId },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            profileImages: true,
            fieldOfExpertise: true,
            displayEmail: true,
            phones: true,
          },
        },
      },
    });

    const contacts = memberContacts.map((mc) => mc.doctor);

    return NextResponse.json(contacts, { status: 200 });
  } catch (err) {
    console.error('Error fetching member contacts:', err);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { memberId, doctorId } = await req.json();

    if (!memberId || !doctorId) {
      return NextResponse.json(
        { error: 'Member ID and Doctor ID required' },
        { status: 400 },
      );
    }

    if (session.user.role !== 'ADMIN' && session.user.id !== memberId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const doctor = await prisma.user.findUnique({
      where: { id: doctorId },
      select: { id: true, role: true },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    const memberDoctor = await prisma.memberDoctor.create({
      data: {
        memberId,
        doctorId,
      },
    });

    return NextResponse.json(
      { message: 'Contact added successfully', data: memberDoctor },
      { status: 201 },
    );
  } catch (err: any) {
    if (err?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Contact already exists' },
        { status: 409 },
      );
    }

    console.error('Error adding member contact:', err);
    return NextResponse.json(
      { error: 'Failed to add contact' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get('memberId');
    const doctorId = searchParams.get('doctorId');

    if (!memberId || !doctorId) {
      return NextResponse.json(
        { error: 'Member ID and Doctor ID required' },
        { status: 400 },
      );
    }

    if (session.user.role !== 'ADMIN' && session.user.id !== memberId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.memberDoctor.deleteMany({
      where: {
        memberId,
        doctorId,
      },
    });

    return NextResponse.json(
      { message: 'Contact removed successfully' },
      { status: 200 },
    );
  } catch (err) {
    console.error('Error removing member contact:', err);
    return NextResponse.json(
      { error: 'Failed to remove contact' },
      { status: 500 },
    );
  }
}
