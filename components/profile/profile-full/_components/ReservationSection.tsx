import Link from "next/link";
import { CalendarPlus2 } from "lucide-react";
import { ReservationLink } from "@/utils/types";

import Divider from "@/components/divider/Divider";

type Props = {
  src?: string;
  reservationLinks?: ReservationLink[];
  isDoctor?: boolean;
};
export default function ReservationSection({ src, reservationLinks, isDoctor }: Props) {
  const computedSrc = src ?? (reservationLinks || []).find(
    (l) => l.type === "Online Termine" || l.type === "Online Reservierungen"
  )?.url;
  if (!computedSrc) return null;
  return (
    <>
      <Divider addClass="my-4" />
      <section className="flex flex-col items-center space-y-4">
        <div className="flex flex-row justify-center align-middle font-semibold text-primary text-2xl text-center">
          <CalendarPlus2 className="self-center mr-2" /><span className="mr-1">Reservierung</span>
        </div>
        <div className="flex align-middle w-full mb-8">
          <Link
            href={computedSrc}
            target="_self"
            className="btn btn-primary text-lg mx-auto flex gap-2 rounded"
          >
            <CalendarPlus2 /> <span>online {isDoctor ? "Termine" : "Reservierung"}</span>
          </Link>
        </div>
      </section>
    </>
  );
}