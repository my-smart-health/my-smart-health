import Link from "next/link";
import React from "react";
import { MapPin } from "lucide-react";
import { Location } from "@/utils/types";

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
      <section className="flex flex-col gap-3 w-full overflow-hidden">

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
              <div key={idx} className="flex flex-col border border-primary rounded-lg shadow-sm bg-white/50">
                {address && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 gap-3 w-full">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <MapPin className="flex-shrink-0 text-primary mt-1" size={20} />
                      <span className="break-words text-sm leading-relaxed">{address}</span>
                    </div>
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="btn btn-primary btn-sm rounded-full px-5 text-white hover:bg-primary/75 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
                    >
                      <MapPin size={16} /> Route
                    </Link>
                  </div>
                )}

                {phone.length > 0 && (
                  <>

                    <div className="flex flex-wrap gap-2 p-3">
                      {phone.map((phoneNum, idx) => (
                        <Link
                          key={idx}
                          href={`tel:${phoneNum}`}
                          className="badge badge-primary py-5 px-4 text-white hover:bg-primary/75 transition-colors duration-200 break-all link">
                          <span className="mr-1">{platformIcons.Phone}</span>{phoneNum}
                        </Link>
                      ))}
                    </div>
                  </>
                )}

                {schedule && schedule.length > 0 && (
                  <div>
                    <ScheduleSection schedule={schedule} />
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