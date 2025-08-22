import { AtSign, Globe, MapPin, Phone } from "lucide-react";

export default function TheHealthBarInfo() {
  const currentTime = new Date();
  const day = currentTime.getDay();
  const hour = currentTime.getHours();
  let isOpen = false;

  if (day >= 1 && day <= 5) {
    isOpen = hour >= 10 && hour < 20;
  } else if (day === 6) {
    isOpen = hour >= 10 && hour < 16;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-center gap-3 text-wrap text-start text-sm ">
        <p className="flex">
          <Phone /> <span className="pl-2">+ 49 123 456 7890</span>
        </p>
        <p className="flex">
          <AtSign /> <span className="pl-2">Info@shop.de</span>
        </p>
        <p className="flex">
          <Globe /> <span className="pl-2">www.healthbar.de</span>
        </p>
        <p className="flex">
          <MapPin />
          <span className="pl-2">Musterstraße 125, 12345 Musterstadt</span>
        </p>
      </div>
      <div className="grid sm:col-span-2 mt-4 gap-1">
        <div className="flex justify-start">
          <p className="flex justify-start mb-2">
            Öffnungszeiten:
          </p>
          <p className="pl-4">
            {isOpen ? <span className="text-green-500">geöffnet</span> : <span className="text-red-500">geschlossen</span>}
          </p>
        </div>
        <div className="flex flex-col gap-2 justify-evenly">
          <div className="flex flex-row ">
            <p className="text-start">Montag - Freitag:</p>
            <p className="pl-2">10:00 - 20:00 Uhr</p>
          </div>
          <div className="flex flex-row ">
            <p className="text-start">Samstag:</p>
            <p className="pl-18">10:00 - 16:00 Uhr</p>
          </div>
        </div>
      </div>
    </>
  );
}
