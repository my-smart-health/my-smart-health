import CategoryButton from "@/components/buttons/category-button/CategoryButton";
import TheHealthBarLink from "@/components/buttons/the-health-bar-link/TheHealthBarLink";
import MySmartHealth from "@/components/my-smart-health/MySmartHealth";
import ProfileSearchToggle from "@/components/search/ProfileSearchToggle";
import { CATEGORY_LINKS } from "@/utils/constants";
import { CirclePlus } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function SmartHealthLayout({ children }: { children: React.ReactNode }) {
  const tCategories = await getTranslations('Categories');

  return (
    <>
      <MySmartHealth />
      <CategoryButton name={tCategories('theLeadingDoctors')} goTo={CATEGORY_LINKS.theLeadingDoctors.link} imageAsTitle={CATEGORY_LINKS.theLeadingDoctors.image} />
      <CategoryButton name={tCategories('mySmartHealthTermineKurzfristig')} goTo="/" imageAsTitle={CATEGORY_LINKS.mySmartHealthTermineKurzfristig.image} active />
      <div className="min-h-full w-full max-w-5xl flex flex-col gap-4">
        {children}
      </div>
      <ProfileSearchToggle label={tCategories('search')} className="max-w-5xl w-full" />
      <CategoryButton name={tCategories('smartHealth')} icon={CATEGORY_LINKS.smartHealth.image} goTo={CATEGORY_LINKS.smartHealth.link} />
      <CategoryButton name={tCategories('medizinUndPflege')} icon={CATEGORY_LINKS.medizinUndPflege.image} goTo={CATEGORY_LINKS.medizinUndPflege.link} />
      <CategoryButton name={tCategories('notfalle')} icon={<CirclePlus size={34} color="red" />} goTo={CATEGORY_LINKS.notfalle.link} />
      <TheHealthBarLink />
    </>
  );
}