import NewsSmartHealthMedizinButton from "@/components/news-smart-health-medizin-button/NewsSmartHealthMedizinButton";

export default async function MedizinUndPflegePage() {
  return (
    <div className="flex flex-col gap-3 w-full mb-auto max-w-[90%]">
      <NewsSmartHealthMedizinButton name="News" icon="/icon2.png" goTo="/news" />
      <NewsSmartHealthMedizinButton name="Smart Health" icon="/icon3.png" goTo="/smart-health" />
      <NewsSmartHealthMedizinButton name="Medizin & Pflege" icon="/icon4.png" goTo="/medizin-und-pflege" active />
      <div className="m-auto min-h-full border">
        <p className="p-4">Medizin Und Pflege content goes here</p>
      </div>
    </div>
  );
}
