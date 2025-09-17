import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const updateUser = await prisma.user.update({
      where: { id: body.id },
      data: {
        ...body.data,
      },
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      data: updateUser,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Failed to update profile',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
