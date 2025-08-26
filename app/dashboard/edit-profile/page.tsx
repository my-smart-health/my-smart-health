import { Session } from "next-auth";
import { redirect } from "next/navigation";
import EditProfileForm from "./EditProfileForm";
import { auth } from "@/auth";


export default async function EditProfile() {
  const session: Session | null = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-4 h-full min-h-[72dvh] max-w-[90%]">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">Edit Profile</h1>
      <EditProfileForm />
    </div>
  );
}
