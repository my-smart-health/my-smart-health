import Divider from "@/components/divider/Divider";
import React from "react";
import { CalendarPlus2, ClipboardPlus, NotebookTabs, ShoppingCart, AtSign } from "lucide-react";
import Link from "next/link";
import { RESERVATION_LINK_TYPES, ReservationLink } from "@/utils/types";

type Props = {
  reservationLinks?: ReservationLink[];
};

export default function PrescriptionReservation({ reservationLinks }: Props) {
  const links = (reservationLinks || []).filter((linkItem) => typeof linkItem.url === "string" && linkItem.url.trim().length > 0);
  if (links.length === 0) return null;
  return (
    <>
      <Divider addClass="my-2" />
      <section className="flex flex-col items-center m-2 space-y-4">
        <div className="flex flex-col gap-3 w-full mb-2">
          {links.map((item, idx) => {
            type LucideIcon = typeof CalendarPlus2;
            let Icon: LucideIcon = CalendarPlus2;
            let label = "online Termine";
            let href = item.url;
            switch (item.type) {
              case RESERVATION_LINK_TYPES.OnlineTermine:
                Icon = CalendarPlus2;
                label = "online Termine";
                break;
              case RESERVATION_LINK_TYPES.OnlineReservierungen:
                Icon = NotebookTabs;
                label = "online Reservierung";
                break;
              case RESERVATION_LINK_TYPES.Rezeptbestellung:
                Icon = ClipboardPlus;
                label = "online Rezept";
                break;
              case RESERVATION_LINK_TYPES.OnlineShop:
                Icon = ShoppingCart;
                label = "Online Shop";
                break;
              case RESERVATION_LINK_TYPES.Email:
                Icon = AtSign;
                label = "Email";
                href = item.url?.toLowerCase().startsWith("mailto:") ? item.url : `mailto:${item.url}`;
                break;
            }
            return (
              <div key={item.id ?? `${item.type}-${item.url}-${idx}`} className="flex align-middle w-full">
                <Link href={href} target="_self" className="btn btn-primary text-lg mx-auto flex gap-2 rounded">
                  <Icon /> <span>{label}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}