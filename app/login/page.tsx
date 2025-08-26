import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';
import { auth } from '@/auth';

export default async function LoginPage() {

  const session = await auth();

  if (session) {
    return redirect("/dashboard");
  }

  return (
    <main className='flex flex-col items-center m-auto h-full min-h-[100%] max-w-[90%] bg-gray-50'>
      <h1 className='mb-8 text-3xl font-bold text-gray-800'>
        Login to your account
      </h1>
      <LoginForm />
    </main>
  );
}
