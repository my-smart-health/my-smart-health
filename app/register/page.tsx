import { auth } from "@/auth";
import RegisterForm from "../../components/register-form/RegisterForm";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";

async function hasUsers() {
  const userCount = await prisma.user.count();
  return userCount > 0;
}

export default async function RegisterPage() {

  const session = await auth();
  const usersExist = await hasUsers();

  if (usersExist) {
    if (!session) {
      redirect("/login");
    }

    const role = session.user?.role;
    if (role !== "ADMIN") {
      redirect("/");
    }
  }

  return (
    <>
      <h1 className="mb-8 text-center text-nowrap text-2xl font-bold text-primary">Create new user</h1>
      <RegisterForm />
    </>
  );
}