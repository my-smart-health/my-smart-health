import { auth } from "@/auth";
import { getTranslations } from "next-intl/server";
import ChangePasswordForm from "@/components/forms/change-password/ChangePasswordForm";
import { redirect } from "next/navigation";

export default async function ChangePasswordPage() {
  const t = await getTranslations('ChangePasswordPage');
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-primary mb-6">{t('title')}</h1>
      <ChangePasswordForm />
    </div>
  );
}