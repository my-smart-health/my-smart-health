'use server';

import { auth } from '@/auth';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function getOrCreateCube() {
  const cube = await prisma.cube.findFirst();
  if (cube) return cube;
  return prisma.cube.create({ data: { onOff: true } });
}

export async function addToCube(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') return redirect('/login');

  const postId = String(formData.get('postId'));
  const cube = await getOrCreateCube();
  const maxOrder = await prisma.posts.aggregate({
    where: { cubeId: cube.id },
    _max: { cubeOrder: true },
  });
  const nextOrder = (maxOrder._max.cubeOrder ?? -1) + 1;
  await prisma.posts.update({
    where: { id: postId },
    data: { cubeId: cube.id, cubeOrder: nextOrder },
  });
  revalidatePath('/dashboard/edit-cube');
  revalidatePath('/');
}

export async function removeFromCube(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') return redirect('/login');

  const postId = String(formData.get('postId'));
  await prisma.posts.update({
    where: { id: postId },
    data: { cubeId: null, cubeOrder: null },
  });
  revalidatePath('/dashboard/edit-cube');
  revalidatePath('/');
}

export async function moveInCube(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') return redirect('/login');

  const postId = String(formData.get('postId'));
  const direction = String(formData.get('direction')) as 'up' | 'down';

  const post = await prisma.posts.findUnique({
    where: { id: postId },
    select: { id: true, cubeId: true, cubeOrder: true },
  });
  if (!post?.cubeId || post.cubeOrder == null) {
    revalidatePath('/dashboard/edit-cube');
    return;
  }

  const neighbor = await prisma.posts.findFirst({
    where: {
      cubeId: post.cubeId,
      cubeOrder:
        direction === 'up' ? { lt: post.cubeOrder } : { gt: post.cubeOrder },
    },
    orderBy: { cubeOrder: direction === 'up' ? 'desc' : 'asc' },
    select: { id: true, cubeOrder: true },
  });

  if (!neighbor) {
    revalidatePath('/dashboard/edit-cube');
    return;
  }

  await prisma.$transaction([
    prisma.posts.update({
      where: { id: post.id },
      data: { cubeOrder: neighbor.cubeOrder },
    }),
    prisma.posts.update({
      where: { id: neighbor.id },
      data: { cubeOrder: post.cubeOrder },
    }),
  ]);

  revalidatePath('/dashboard/edit-cube');
  revalidatePath('/');
}

export async function moveUpInCube(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') return redirect('/login');

  const postId = String(formData.get('postId'));
  const post = await prisma.posts.findUnique({
    where: { id: postId },
    select: { id: true, cubeId: true, cubeOrder: true },
  });
  if (!post?.cubeId || post.cubeOrder == null) {
    revalidatePath('/dashboard/edit-cube');
    return;
  }

  const neighbor = await prisma.posts.findFirst({
    where: { cubeId: post.cubeId, cubeOrder: { lt: post.cubeOrder } },
    orderBy: { cubeOrder: 'desc' },
    select: { id: true, cubeOrder: true },
  });
  if (!neighbor) {
    revalidatePath('/dashboard/edit-cube');
    return;
  }

  await prisma.$transaction([
    prisma.posts.update({
      where: { id: post.id },
      data: { cubeOrder: neighbor.cubeOrder },
    }),
    prisma.posts.update({
      where: { id: neighbor.id },
      data: { cubeOrder: post.cubeOrder },
    }),
  ]);
  revalidatePath('/dashboard/edit-cube');
  revalidatePath('/');
}

export async function moveDownInCube(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') return redirect('/login');

  const postId = String(formData.get('postId'));
  const post = await prisma.posts.findUnique({
    where: { id: postId },
    select: { id: true, cubeId: true, cubeOrder: true },
  });
  if (!post?.cubeId || post.cubeOrder == null) {
    revalidatePath('/dashboard/edit-cube');
    return;
  }

  const neighbor = await prisma.posts.findFirst({
    where: { cubeId: post.cubeId, cubeOrder: { gt: post.cubeOrder } },
    orderBy: { cubeOrder: 'asc' },
    select: { id: true, cubeOrder: true },
  });
  if (!neighbor) {
    revalidatePath('/dashboard/edit-cube');
    return;
  }

  await prisma.$transaction([
    prisma.posts.update({
      where: { id: post.id },
      data: { cubeOrder: neighbor.cubeOrder },
    }),
    prisma.posts.update({
      where: { id: neighbor.id },
      data: { cubeOrder: post.cubeOrder },
    }),
  ]);
  revalidatePath('/dashboard/edit-cube');
  revalidatePath('/');
}

export async function toggleCube(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') return redirect('/login');

  const onOff = String(formData.get('onOff')) === 'on';
  const cube = await getOrCreateCube();
  await prisma.cube.update({ where: { id: cube.id }, data: { onOff } });
  revalidatePath('/dashboard/edit-cube');
  revalidatePath('/');
}

export async function getCubePosts(cubeId: string) {
  return prisma.posts.findMany({
    where: { cubeId },
    orderBy: [{ cubeOrder: 'asc' }, { createdAt: 'desc' }],
    select: { id: true, title: true, photos: true, cubeOrder: true },
  });
}

export async function getNewsNotInCube() {
  return prisma.posts.findMany({
    where: { cubeId: null },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, photos: true },
    take: 50,
  });
}
