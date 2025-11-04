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
      {(phoneNumbers.length > 0 || displayEmail || website || locations.length > 0 || parsedSocials.length > 0 || !platformIcons) && (
        <Divider addClass="mt-1" />
      )}

      <section className="flex flex-col gap-4 w-full overflow-hidden">

        {locations.length > 0 &&
          locations.map((location, idx) => {
            const address = location.address;
            const phone = location.phone;
            const schedule = location.schedule as Schedule[] | null;
            return (
              <div key={idx} className="flex flex-col rounded px-4">
                {idx > 0 && <Divider addClass="my-4" />}
                {address && (
                  <div className="flex flex-col items-start gap-1 break-words w-full">
                    <span className="break-words flex-1">{address}</span>
                    <div className="">
                      <Link
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex flex-wrap font-bold text-primary text-lg hover:text-primary/75 transition-colors duration-200 underline"
                      >
                        <MapPin className="flex-shrink-0 mt-1" size={20} /> Route planen
                      </Link>
                    </div>
                  </div>
                )}

                {schedule && (
                  <div>
                    {schedule.length > 0 && (
                      <>
                        <ScheduleSection schedule={schedule} />
                      </>
                    )}
                  </div>
                )}

                {phone.length > 0 && (
                  <>
                    <div className="flex flex-wrap mx-auto mt-6 gap-2">
                      {phone.map((phone, idx) => (
                        <Link
                          key={idx}
                          href={`tel:${phone}`}
                          className="badge badge-primary py-5 text-white hover:bg-primary/75 transition-colors duration-200 break-all break-before-left link">
                          <span className="mr-1">{platformIcons.Phone}</span>{phone}
                        </Link>
                      ))}
                    </div>
                  </>
                )}

              </div>
            );
          })}

        <div className="flex flex-wrap gap-2 mx-auto">
          {phoneNumbers.length > 0 && phoneNumbers.map((phone, idx) => (
            <div key={idx} className="flex items-center h-auto my-auto">
              <Link
                href={`tel:${phone}`}
                className="badge badge-primary py-5 text-white hover:bg-primary/75 transition-colors duration-200 break-all break-before-left link">
                <span className="mr-1">{platformIcons.Phone}</span>{phone}
              </Link>
            </div>
          ))}
        </div>

        {(displayEmail || website || parsedSocials.length > 0) && (
          <div className="flex flex-wrap gap-2 mx-auto">

            {displayEmail && (
              <Link
                href={`mailto:${displayEmail}`}
                className="badge badge-primary p-5 text-white hover:bg-primary/75 transition-colors duration-200 break-all break-before-left link">
                <span className="mr-1">{platformIcons.Email}</span>
                Email
              </Link>
            )}

            {website && (
              <Link
                href={website}
                target="_blank"
                rel="noreferrer noopener"
                className="badge badge-primary p-5 text-white hover:bg-primary/75 transition-colors duration-200 break-all break-before-left link">
                <span className="mr-1">{platformIcons.Website}</span>
                Website
              </Link>
            )}

            {parsedSocials.length > 0 && parsedSocials.map((social, idx) => (
              <div key={social.url + idx} className="flex items-center my-auto">
                <Link
                  href={social.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="badge badge-primary p-5 text-white hover:bg-primary/75 transition-colors duration-200 break-all break-before-left link">
                  <span className="mr-1">{platformIcons[social.platform]}</span>
                  {social.platform}
                </Link>
              </div>
            ))}

          </div>
        )}

      </section >
    </>
  );
}