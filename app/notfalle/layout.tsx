import NewsSmartHealthMedizinButton from "@/components/buttons/news-smart-health-medizin-button/NewsSmartHealthMedizinButton";
import TheHealthBarLink from "@/components/buttons/the-health-bar-link/TheHealthBarLink";
import MySmartHealth from "@/components/my-smart-health/MySmartHealth";
import ProfileSearchToggle from "@/components/search/ProfileSearchToggle";
import { CATEGORY_NAMES } from "@/utils/constants";
import { CirclePlus } from "lucide-react";

export const revalidate = 0;

export default async function SmartHealthLayout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <MySmartHealth />
      <ProfileSearchToggle className="max-w-5xl w-full" />
      <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.news.name} icon="/icon2.png" goTo={CATEGORY_NAMES.news.link} />
      <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.theLeadingDoctors.name} goTo={CATEGORY_NAMES.theLeadingDoctors.link} imageAsTitle="/the-leading-doctors.png" />
      <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.smartHealth.name} icon="/icon3.png" goTo={CATEGORY_NAMES.smartHealth.link} />
      <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.medizinUndPflege.name} icon="/icon4.png" goTo={CATEGORY_NAMES.medizinUndPflege.link} />
      <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.notfalle.name} icon={<CirclePlus size={34} color="red" />} goTo="/" active />
      <div className="min-h-full w-full max-w-5xl flex flex-col gap-4">
        {children}
      </div>
      <TheHealthBarLink />
    </>
  );
}