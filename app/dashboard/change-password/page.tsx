import { auth } from "@/auth";
import ChangePasswordForm from "@/components/forms/change-password/ChangePasswordForm";
import { redirect } from "next/navigation";

export default async function ChangePasswordPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-primary mb-6">Change Password</h1>
      <ChangePasswordForm />
    </div>
  );
}