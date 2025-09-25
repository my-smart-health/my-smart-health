import prisma from "@/lib/db";
import GoBack from "@/components/buttons/go-back/GoBack";
import EditUserCategory from "./EditUserCategory";
import { revalidatePath } from "next/cache";

async function getUserCategoryById(id: string) {
  const categories = await prisma.user.findUnique({
    where: { id },
    select: { name: true, category: true },
  });

  return categories;
}

// --- Server Action ---
export async function updateUserCategoryAction(id: string, categories: string[]) {
  "use server";
  await prisma.user.update({
    where: { id },
    data: { category: categories },
  });
  revalidatePath(`/dashboard/edit-user-category/${id}`);
}

export default async function EditUserCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return (
      <>
        <div>Invalid user ID</div>
        <GoBack />
      </>
    );
  }

  const user = await getUserCategoryById(id);

  if (!user) {
    return (
      <>
        <div>User not found</div>
        <GoBack />
      </>
    );
  }

  return (
    <main>
      <h1>Edit User Category</h1>
      <p>User ID: {id}</p>
      <p>User Name: {user.name}</p>
      <EditUserCategory
        initialCategories={user.category || []}
        onSaveAction={async (newCategories) => {
          "use server";
          await updateUserCategoryAction(id, newCategories);
        }}
      />
    </main>
  );
}
