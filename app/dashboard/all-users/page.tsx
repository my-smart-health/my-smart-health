import prisma from "@/lib/db";
import UserTable from "@/components/user/UserTable";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      category: true,
      role: true,
      profileImages: true,
    }
  });
}

export default async function AllUsersPage() {

  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return (redirect("/login"));
  }

  const users = await getAllUsers();

  if (!users) {
    return (
      <main className="flex flex-col items-center justify-center gap-3 w-full mb-auto max-w-[100%]">
        <div>No users found</div>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-4 items-center min-h-[72dvh] py-8 max-w-[99.9%] text-wrap break-normal overflow-clip overscroll-x-none">
      <h1>All Users</h1>
      <UserTable users={users} />
    </main>
  );
}
