import NewsSmartHealthMedizinButton from "@/components/buttons/news-smart-health-medizin-button/NewsSmartHealthMedizinButton";

export default async function SmartHealthLayout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <NewsSmartHealthMedizinButton name="News" icon="/icon2.png" goTo="/news" />
      <NewsSmartHealthMedizinButton name="Smart Health" icon="/icon3.png" goTo="/smart-health" />
      <NewsSmartHealthMedizinButton name="Medizin & Pflege" icon="/icon4.png" goTo="/" active />
      <div className="min-h-full w-full max-w-5xl flex flex-col gap-4">
        {children}
      </div>
    </>
  );
}