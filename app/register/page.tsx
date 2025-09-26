import { auth } from "@/auth";
import RegisterForm from "../../components/register-form/RegisterForm";
import { redirect } from "next/navigation";

export default async function RegisterPage() {

  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const sessionUser = session.user.role;
  if (sessionUser !== "ADMIN") {
    redirect("/");
  }

  return (
    <>
      <h1 className="mb-8 text-center text-nowrap text-2xl font-bold text-primary">Create new account</h1>
      <RegisterForm />
    </>
  );
}