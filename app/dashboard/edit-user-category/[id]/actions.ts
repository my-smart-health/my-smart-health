'use server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateUserCategoryAction(
  id: string,
  categories: string[]
) {
  await prisma.user.update({
    where: { id },
    data: { category: categories },
  });
  revalidatePath(`/dashboard/edit-user-category/${id}`);
}
