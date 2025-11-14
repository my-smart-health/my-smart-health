import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import type { MySmartHealthInfo } from '@/utils/types';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    const { id, generalTitle, paragraph } = body as Partial<MySmartHealthInfo>;

    if (!paragraph) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    let entry = await prisma.mySmartHealth.findFirst();

    if (!entry) {
      entry = await prisma.mySmartHealth.create({
        data: { generalTitle, paragraph },
      });
    } else {
      entry = await prisma.mySmartHealth.update({
        where: { id: id || entry.id },
        data: { generalTitle, paragraph },
      });
    }

    return NextResponse.json(
      { message: 'Update successful', data: entry },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Server error',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
