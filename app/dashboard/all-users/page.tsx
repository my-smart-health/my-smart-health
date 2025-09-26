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
      <>
        <div>No users found</div>
      </>
    );
  }

  return (
    <>
      <h1>All Users</h1>
      <UserTable users={users} />
    </>
  );
}
