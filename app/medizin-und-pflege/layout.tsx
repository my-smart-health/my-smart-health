import NewsSmartHealthMedizinButton from "@/components/buttons/news-smart-health-medizin-button/NewsSmartHealthMedizinButton";
import TheHealthBarLink from "@/components/buttons/the-health-bar-link/TheHealthBarLink";
import MySmartHealth from "@/components/my-smart-health/MySmartHealth";
import { CATEGORY_NAMES } from "@/utils/constants";
import { CirclePlus } from "lucide-react";

export default async function SmartHealthLayout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <MySmartHealth />
      <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.news.name} icon="/icon2.png" goTo={CATEGORY_NAMES.news.link} />
      <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.smartHealth.name} icon="/icon3.png" goTo={CATEGORY_NAMES.smartHealth.link} />
      <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.medizinUndPflege.name} icon="/icon4.png" goTo="/" active />
      <div className="min-h-full w-full max-w-5xl flex flex-col gap-4">
        {children}
      </div>
      <NewsSmartHealthMedizinButton name={CATEGORY_NAMES.notfalle.name} icon={<CirclePlus size={34} color="red" />} goTo={CATEGORY_NAMES.notfalle.link} />
      <TheHealthBarLink />
    </>
  );
}