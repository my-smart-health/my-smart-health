import Divider from "@/components/divider/Divider";
import React from "react";
import { CalendarPlus2, ClipboardPlus, NotebookTabs, ShoppingCart, AtSign } from "lucide-react";
import Link from "next/link";
import { RESERVATION_LINK_TYPES, ReservationLink, Membership } from "@/utils/types";
import { MembershipSection } from ".";

type Props = {
  reservationLinks?: ReservationLink[];
  membership?: Membership | null;
};

export default function PrescriptionReservation({ reservationLinks, membership = null }: Props) {
  const links = (reservationLinks || []).filter((linkItem) => typeof linkItem.url === "string" && linkItem.url.trim().length > 0);
  if (links.length === 0) return null;

  const emailLinks = links.filter(item => item.type === RESERVATION_LINK_TYPES.Email);
  const nonEmailLinks = links.filter(item => item.type !== RESERVATION_LINK_TYPES.Email);

  const hasOnlineTermine = nonEmailLinks.some(item => item.type === RESERVATION_LINK_TYPES.OnlineTermine);

  return (
    <>
      <Divider addClass="my-1" />
      <section className="flex flex-col items-center m-2 space-y-4">

        <div className="flex flex-col gap-3 w-full mb-2">
          {nonEmailLinks.map((item, idx) => {
            type LucideIcon = typeof CalendarPlus2;
            let Icon: LucideIcon = CalendarPlus2;
            let label = "online Termine";
            const href = item.url;
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
            }

            const isFirstOnlineTermine = idx === 0 && item.type === RESERVATION_LINK_TYPES.OnlineTermine;

            return (
              <React.Fragment key={item.id ?? `${item.type}-${item.url}-${idx}`}>
                {membership?.status && hasOnlineTermine && isFirstOnlineTermine && (
                  <>
                    <div className="place-self-center">
                      <MembershipSection membership={membership} />
                    </div>
                    <Divider addClass="my-1" />
                  </>
                )}
                <div className="flex align-middle justify-center place-items-center w-full">
                  <Link href={href} target="_self" className="btn btn-primary text-lg flex gap-2 rounded">
                    <Icon /> <span>{label}</span>
                  </Link>
                </div>
              </ React.Fragment>
            );
          })}
        </div>

        {emailLinks.length > 0 && (
          <div className="flex flex-col gap-3 w-full mb-2">
            {emailLinks.map((item, idx) => (
              <React.Fragment key={item.id ?? `${item.type}-${item.url}-${idx}`}>
                <Divider addClass="my-1" />
                <div className="flex align-middle justify-center place-items-center w-full">
                  <Link href={item.url} target="_self" className="btn btn-primary text-lg flex gap-2 rounded">
                    <AtSign /> <span>Email</span>
                  </Link>
                </div>
              </ React.Fragment>
            ))}
          </div>
        )}
      </section>
    </>
  );
}