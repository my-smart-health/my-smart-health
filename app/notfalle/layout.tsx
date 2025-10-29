import NewsSmartHealthMedizinButton from "@/components/buttons/news-smart-health-medizin-button/NewsSmartHealthMedizinButton";
import TheHealthBarLink from "@/components/buttons/the-health-bar-link/TheHealthBarLink";
import MySmartHealth from "@/components/my-smart-health/MySmartHealth";
import { CirclePlus } from "lucide-react";

export default async function SmartHealthLayout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <MySmartHealth />
      <NewsSmartHealthMedizinButton name="News" icon="/icon2.png" goTo="/news" />
      <NewsSmartHealthMedizinButton name="Meine Gesundheit" icon="/icon3.png" goTo="/smart-health" />
      <NewsSmartHealthMedizinButton name="Medizin & Pflege" icon="/icon4.png" goTo="/medizin-und-pflege" />
      <NewsSmartHealthMedizinButton name="Notfälle" icon={<CirclePlus size={34} color="red" />} goTo="/" active />
      <div className="min-h-full w-full max-w-5xl flex flex-col gap-4">
        {children}
      </div>
      <TheHealthBarLink />
    </>
  );
}