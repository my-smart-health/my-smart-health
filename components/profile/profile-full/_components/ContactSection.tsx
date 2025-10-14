import Link from "next/link";
import { MapPin } from "lucide-react";
import { Location } from "@prisma/client";

import Divider from "@/components/divider/Divider";
import { Schedule } from "@/utils/types";
import ScheduleSection from "./ScheduleSection";

export default function ContactSection({
  phoneNumbers,
  displayEmail,
  website,
  locations,
  parsedSocials,
  platformIcons,
}: {
  phoneNumbers: string[];
  displayEmail: string | null;
  website: string | null;
  locations: Location[];
  parsedSocials: { platform: string; url: string }[];
  platformIcons: Record<string, React.ReactNode>;
}) {

  return (
    <>
      {phoneNumbers.length > 0 || displayEmail || website || locations.length > 0 || parsedSocials.length > 0 || !platformIcons && (
        <Divider addClass="my-4" />
      )}

      <section className="grid grid-cols-1 gap-3">

        {locations.length > 0 &&
          locations.map((location, idx) => {
            const address = location.address;
            const phone = location.phone;
            const schedule = location.schedule as Schedule[] | null;
            return (
              <div key={idx} className="flex flex-col gap-1 border border-primary rounded p-4">
                {address && (
                  <div className="flex flex-col">
                    <h2 className="font-bold text-primary text-lg">Adresse</h2>
                    <div><MapPin className="inline-block mr-1" size={20} />{address}</div>
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="indent-7 text-primary font-bold text-lg hover:text-primary transition-colors duration-200"
                    >
                      Route planen
                    </Link>
                  </div>
                )}

                {schedule && (
                  <div className="mt-2">
                    {schedule.length > 0 && (
                      <>
                        <Divider addClass="my-4" />
                        <h2 className="font-bold text-primary text-xl">Öffnungszeiten</h2>
                        <ScheduleSection schedule={schedule} />
                      </>
                    )}
                  </div>
                )}

                {phone.length > 0 && (
                  <>
                    <Divider addClass="my-4" />
                    <h2 className="font-bold text-primary text-lg">Telefon</h2>
                    {phone.map((phone, idx) => (
                      <Link
                        key={idx}
                        href={`tel:${phone}`}
                        className="text-gray-700 w-fit hover:text-primary transition-colors duration-200 link">
                        <span className="mr-1">{platformIcons.Phone}</span>{phone}
                      </Link>
                    ))}
                  </>
                )}

              </div>
            );
          })}

        {phoneNumbers.length > 0 && phoneNumbers.map((phone, idx) => (
          <Link
            key={idx}
            href={`tel:${phone}`}
            className="text-gray-700 w-fit hover:text-primary transition-colors duration-200 link">
            <span className="mr-1">{platformIcons.Phone}</span>{phone}
          </Link>
        ))}

        <div className="grid grid-cols-4 justify-evenly my-3">

          {displayEmail && (
            <Link
              href={`mailto:${displayEmail}`}
              className="text-gray-700 w-fit hover:text-primary transition-colors duration-200 break-all break-before-left link">
              <span className="mr-1">{platformIcons.Email}</span>
              {/* {displayEmail} */}
            </Link>
          )}

          {website && (
            <Link
              href={website}
              target="_blank"
              rel="noreferrer noopener"
              className="text-gray-700 w-fit hover:text-primary transition-colors duration-200 break-all break-before-left link">
              <span className="mr-1">{platformIcons.Website}</span>
              {/* {website} */}
            </Link>
          )}

          {parsedSocials.length > 0 && parsedSocials.map((social, idx) => (
            <div key={social.url + idx} className="flex items-center w-full h-auto my-auto">
              <Link
                href={social.url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex justify-center items-center text-gray-700 hover:text-primary transition-colors duration-200 break-all link max-w-[99%]">
                <span className="mr-1">{platformIcons[social.platform]}</span>
                {/* {social.url} */}
              </Link>
            </div>
          ))}

        </div>
      </section>
    </>
  );
}