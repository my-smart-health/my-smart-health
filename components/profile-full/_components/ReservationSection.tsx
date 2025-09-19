import Link from "next/link";
import { CalendarPlus2 } from "lucide-react";

import Divider from "@/components/divider/Divider";

export default function ReservationSection() {
  return (
    <section className="flex flex-col items-center space-y-4">
      <Divider addClass="my-4" />
      <div className="flex flex-row justify-center align-middle font-semibold text-primary text-2xl text-center">
        <CalendarPlus2 className="self-center mr-2" /><span className="mr-1">Reservierung</span>
      </div>
      <div className="flex align-middle w-full mb-8">
        <Link
          href="https://moers.cms.shic.us/Arzttemin_reservieren"
          target="_self"
          className="btn btn-primary text-lg mx-auto flex gap-2 rounded"
        >
          <CalendarPlus2 /> <span>online Termine - Reservierung</span>
        </Link>
      </div>
    </section>
  );
}