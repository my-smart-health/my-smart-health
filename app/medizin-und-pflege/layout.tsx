import GoBack from "@/components/buttons/go-back/GoBack";
import NewsSmartHealthMedizinButton from "@/components/buttons/news-smart-health-medizin-button/NewsSmartHealthMedizinButton";

export default async function SmartHealthLayout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <NewsSmartHealthMedizinButton name="News" icon="/icon2.png" goTo="/news" />
      <NewsSmartHealthMedizinButton name="Smart Health" icon="/icon3.png" goTo="/smart-health" active />
      <NewsSmartHealthMedizinButton name="Medizin & Pflege" icon="/icon4.png" goTo="/medizin-und-pflege" />
      <div className="m-auto min-h-full w-full max-w-5xl flex flex-col gap-4 p-4">
        <span className="self-end"><GoBack /></span>
        {children}
      </div>
    </>
  );
}