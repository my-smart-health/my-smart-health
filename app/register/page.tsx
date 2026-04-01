import { auth } from "@/auth";
import RegisterForm from "../../components/register-form/RegisterForm";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function RegisterPage() {
  const t = await getTranslations('RegisterPage');

  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <>
      <h1 className="mb-8 text-center text-nowrap text-2xl font-bold text-primary">{t('title')}</h1>
      <RegisterForm />
    </>
  );
}