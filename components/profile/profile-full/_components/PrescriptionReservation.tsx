import Divider from "@/components/divider/Divider";
import { CalendarPlus2, ClipboardPlus, NotebookTabs, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { RESERVATION_LINK_TYPES, ReservationLink } from "@/utils/types";

type Props = {
  reservationLinks?: ReservationLink[];
};

export default function PrescriptionReservation({ reservationLinks }: Props) {
  const links = (reservationLinks || []).filter((l) => typeof l.url === "string" && l.url.trim().length > 0);

  const [appointmentLinks, reservationLinksOnly, prescriptionGroup, shopGroup] = links.reduce<[
    ReservationLink[],
    ReservationLink[],
    ReservationLink[],
    ReservationLink[]
  ]>((acc, link) => {
    switch (link.type) {
      case RESERVATION_LINK_TYPES.OnlineTermine:
        acc[0].push(link);
        break;
      case RESERVATION_LINK_TYPES.OnlineReservierungen:
        acc[1].push(link);
        break;
      case RESERVATION_LINK_TYPES.Rezeptbestellung:
        acc[2].push(link);
        break;
      case RESERVATION_LINK_TYPES.OnlineShop:
        acc[3].push(link);
        break;
      default:
        break;
    }
    return acc;
  }, [[], [], [], []]);

  if (
    appointmentLinks.length === 0 &&
    reservationLinksOnly.length === 0 &&
    prescriptionGroup.length === 0 &&
    shopGroup.length === 0
  )
    return null;

  return (
    <>
      {(appointmentLinks.length > 0 || reservationLinksOnly.length > 0) && (
        <>
          <Divider addClass="my-4" />
          <section className="flex flex-col items-center space-y-4">
            <div className="flex flex-row justify-center align-middle font-semibold text-primary text-2xl text-center">
              <CalendarPlus2 className="self-center mr-2" />
              <span className="mr-1">Reservierung</span>
            </div>
            <div className="flex flex-col gap-3 w-full mb-2">
              {[...appointmentLinks, ...reservationLinksOnly].map((r) => {
                const isAppointment = r.type === RESERVATION_LINK_TYPES.OnlineTermine;
                const Icon = isAppointment ? CalendarPlus2 : NotebookTabs;
                const label = isAppointment ? "online Termine" : "online Reservierung";
                return (
                  <div key={`${r.type}-${r.url}`} className="flex align-middle w-full">
                    <Link href={r.url} target="_self" className="btn btn-primary text-lg mx-auto flex gap-2 rounded">
                      <Icon /> <span>{label}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {prescriptionGroup.length > 0 && (
        <>
          <Divider addClass="my-4" />
          <section className="flex flex-col items-center space-y-4">
            <div className="flex flex-row justify-center align-middle font-semibold text-primary text-2xl text-center">
              <ClipboardPlus className="self-center mr-2" />
              <span className="mr-1">Rezept</span>
            </div>
            <div className="flex flex-col gap-3 w-full mb-2">
              {prescriptionGroup.map((p) => (
                <div key={`${p.type}-${p.url}`} className="flex align-middle w-full">
                  <Link href={p.url} target="_self" className="btn btn-primary text-lg mx-auto flex gap-2 rounded">
                    <ClipboardPlus /> <span>online Rezept</span>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {shopGroup.length > 0 && (
        <>
          <Divider addClass="my-4" />
          <section className="flex flex-col items-center space-y-4">
            <div className="flex flex-row justify-center align-middle font-semibold text-primary text-2xl text-center">
              <ShoppingCart className="self-center mr-2" />
              <span className="mr-1">Shop</span>
            </div>
            <div className="flex flex-col gap-3 w-full mb-2">
              {shopGroup.map((s) => (
                <div key={`${s.type}-${s.url}`} className="flex align-middle w-full">
                  <Link href={s.url} target="_self" className="btn btn-primary text-lg mx-auto flex gap-2 rounded">
                    <ShoppingCart /> <span>Online Shop</span>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}