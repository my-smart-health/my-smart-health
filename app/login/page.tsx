import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import LoginForm from '../../components/login-form/LoginForm';
import { auth } from '@/auth';

export default async function LoginPage() {
  const t = await getTranslations('LoginPage');

  const session = await auth();

  if (session) {
    return redirect("/dashboard");
  }

  return (
    <>
      <h1 className='mb-8 text-3xl font-bold text-gray-800'>
        {t('title')}
      </h1>
      <LoginForm />
    </>
  );
}
