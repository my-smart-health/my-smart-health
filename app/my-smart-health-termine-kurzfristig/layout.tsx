import CategoryButton from "@/components/buttons/category-button/CategoryButton";
import TheHealthBarLink from "@/components/buttons/the-health-bar-link/TheHealthBarLink";
import MySmartHealth from "@/components/my-smart-health/MySmartHealth";
import ProfileSearchToggle from "@/components/search/ProfileSearchToggle";
import { CATEGORY_NAMES } from "@/utils/constants";
import { CirclePlus } from "lucide-react";

export default async function SmartHealthLayout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <MySmartHealth />
      <ProfileSearchToggle className="max-w-5xl w-full" />
      <CategoryButton name={CATEGORY_NAMES.theLeadingDoctors.name} goTo={CATEGORY_NAMES.theLeadingDoctors.link} imageAsTitle="/the-leading-doctors.png" />
      <CategoryButton name={CATEGORY_NAMES.mySmartHealthTermineKurzfristig.name} goTo='/' imageAsTitle="/termine-kurzfristig-neutral.png" active />
      <div className="min-h-full w-full max-w-5xl flex flex-col gap-4">
        {children}
      </div>
      <CategoryButton name={CATEGORY_NAMES.smartHealth.name} icon="/icon3.png" goTo={CATEGORY_NAMES.smartHealth.link} />
      <CategoryButton name={CATEGORY_NAMES.medizinUndPflege.name} icon="/icon4.png" goTo={CATEGORY_NAMES.medizinUndPflege.link} />
      <CategoryButton name={CATEGORY_NAMES.notfalle.name} icon={<CirclePlus size={34} color="red" />} goTo={CATEGORY_NAMES.notfalle.link} />
      <TheHealthBarLink />
    </>
  );
}