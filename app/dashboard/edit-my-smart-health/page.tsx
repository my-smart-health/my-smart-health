import { auth } from "@/auth";
import prisma from "@/lib/db";
import { CACHE_STRATEGY } from "@/utils/constants";

import { redirect } from "next/navigation";
import MySmartHealthForm from "@/components/forms/msh-form/MySmartHealthForm";
import type { MySmartHealthFormLocation } from "@/components/forms/msh-form/_components/mshFormSanitizers";
import { MySmartHealthInfo, Schedule } from "@/utils/types";
import { getTranslations } from "next-intl/server";

async function getMySmartHealthInfo() {
  const mySmartHealthData = await prisma.mySmartHealth.findFirst({
    cacheStrategy: CACHE_STRATEGY.NONE,
  });
  return mySmartHealthData as MySmartHealthInfo | null;
}

async function getMySmartHealthLocations(): Promise<MySmartHealthFormLocation[]> {
  const locations = await prisma.mySmartHealthLocation.findMany({
    cacheStrategy: CACHE_STRATEGY.NONE,
  });
  return locations.map((loc: (typeof locations)[number]) => ({
    ...loc,
    schedule: (loc.schedule as unknown) as Schedule[] | null,
  }));
}

export default async function EditMySmartHealthPage() {
  const t = await getTranslations("EditMySmartHealthPage");
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
      <h1 className="mb-8 text-center text-wrap text-2xl font-bold text-primary">{t('title')}</h1>
      <MySmartHealthForm smartHealthData={mySmartHealth} initialLocations={locations} />
    </>
  );
}