import { redirect } from 'next/navigation';
import LoginForm from '../../components/login-form/LoginForm';
import { auth } from '@/auth';

export default async function LoginPage() {

  const session = await auth();

  if (session) {
    return redirect("/dashboard");
  }

  return (
    <>
      <h1 className='mb-8 text-3xl font-bold text-gray-800'>
        Login to your account
      </h1>
      <LoginForm />
    </>
  );
}
