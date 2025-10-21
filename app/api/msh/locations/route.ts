import prisma from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const locations = await prisma.mySmartHealthLocation.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(locations);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching MSH locations:', error);
    }
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { address, phone = [], schedule = null, mySmartHealthId } = body;

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    let parentId = mySmartHealthId;
    if (!parentId) {
      const msh = await prisma.mySmartHealth.findFirst();
      if (!msh) {
        return NextResponse.json(
          { error: 'MySmartHealth record not found' },
          { status: 500 }
        );
      }
      parentId = msh.id;
    }

    const created = await prisma.mySmartHealthLocation.create({
      data: {
        address,
        phone,
        schedule,
        mySmartHealthId: parentId,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error creating MSH location:', error);
    }
    return NextResponse.json(
      { error: 'Failed to create location' },
      { status: 500 }
    );
  }
}
