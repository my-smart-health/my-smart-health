import Link from "next/link";
import React from "react";
import { MapPin } from "lucide-react";
import { Location } from "@/utils/types";

import Divider from "@/components/divider/Divider";
import { ReservationLink, Schedule } from "@/utils/types";
import ScheduleSection from "./ScheduleSection";
import PrescriptionReservation from "./PrescriptionReservation";

export default function ContactSection({
  locations,
  platformIcons,
}: {
  phoneNumbers: string[];
  locations: Location[];
  platformIcons: Record<string, React.ReactNode>;
}) {

  return (
    <>
      {(locations.length > 0 || !platformIcons) && (
        <Divider addClass="mt-1" />
      )}

      <section className="flex flex-col gap-4 w-full overflow-hidden">

        {locations.length > 0 &&
          locations.map((location, idx) => {
            const address = location.address;
            const phone = location.phone;
            const schedule = location.schedule as Schedule[] | null;
            const locReservationLinks: ReservationLink[] = Array.isArray(location.reservationLinks)
              ? location.reservationLinks.filter(
                (reservationLink) => reservationLink && typeof reservationLink.url === 'string' && reservationLink.url.trim().length > 0
              )
              : [];
            return (
              <div key={idx} className="flex flex-col p-4 border border-primary rounded">
                {idx > 0 && <Divider addClass="my-1" />}
                {address && (
                  <div className="flex flex-row items-start gap-1 break-words w-full justify-between">
                    <span className="break-words my-auto">{address}</span>
                    <div className="">
                      <Link
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="badge badge-primary badge-xl my-1 mr-10 py-5 w-full text-white hover:bg-primary/75 transition-colors duration-200 break-all break-before-left link"
                      >
                        <MapPin className="flex-shrink-0 mt-0" size={20} /> Route
                      </Link>
                    </div>
                  </div>
                )}

                {phone.length > 0 && (
                  <>
                    <Divider addClass="my-1" />
                    <div className="flex flex-wrap mx-auto mt-2 gap-2">
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

                {schedule && (
                  <div>
                    {schedule.length > 0 && (
                      <>
                        <ScheduleSection schedule={schedule} />
                      </>
                    )}
                  </div>
                )}

                {locReservationLinks.length > 0 && (
                  <PrescriptionReservation reservationLinks={locReservationLinks} />
                )}

              </div >
            );
          })}

      </section >
    </>
  );
}