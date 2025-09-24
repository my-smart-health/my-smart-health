import { auth } from "@/auth";
import prisma from "@/lib/db";

import { redirect } from "next/navigation";
import MySmartHealthForm from "../../../components/my-smart-health/_components/MySmartHealthForm";
import { MySmartHealthInfo } from "@/utils/types";

async function getMySmartHealthInfo() {
  const mySmartHealthData = await prisma.mySmartHealth.findFirst();
  return mySmartHealthData as MySmartHealthInfo | null;
}

export default async function EditMySmartHealthPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  const sessionUser = session.user.role;
  if (sessionUser !== "ADMIN") {
    redirect("/");
  }

  const mySmartHealth = await getMySmartHealthInfo();

  return (
    <main className="my-auto w-full max-w-[90%] mx-auto bg-gray-50 border p-2 border-primary rounded">
      <h1 className="mb-8 text-center text-wrap text-2xl font-bold text-primary">Edit My Smart Health Information</h1>
      <MySmartHealthForm smartHealthData={mySmartHealth} />
    </main>
  );
}