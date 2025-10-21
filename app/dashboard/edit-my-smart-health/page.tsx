import { auth } from "@/auth";
import prisma from "@/lib/db";

import { redirect } from "next/navigation";
import MySmartHealthForm from "../../../components/my-smart-health/_components/MySmartHealthForm";
import { MySmartHealthInfo, Schedule } from "@/utils/types";

type MSHLocation = {
  id: string;
  address: string;
  phone: string[];
  schedule: Schedule[] | null;
  mySmartHealthId?: string | null;
};

async function getMySmartHealthInfo() {
  const mySmartHealthData = await prisma.mySmartHealth.findFirst();
  return mySmartHealthData as MySmartHealthInfo | null;
}

async function getMySmartHealthLocations() {
  const locations = await prisma.mySmartHealthLocation.findMany();
  return locations.map(loc => ({
    ...loc,
    schedule: (loc.schedule as unknown) as Schedule[] | null,
  })) as MSHLocation[];
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
  const locations = await getMySmartHealthLocations();

  return (
    <>
      <h1 className="mb-8 text-center text-wrap text-2xl font-bold text-primary">Edit My Smart Health Information</h1>
      <MySmartHealthForm smartHealthData={mySmartHealth} initialLocations={locations} />
    </>
  );
}