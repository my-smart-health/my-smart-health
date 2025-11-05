import Divider from "@/components/divider/Divider";
import { ClipboardPlus } from "lucide-react";
import Link from "next/link";
import { ReservationLink } from "@/utils/types";

type Props = {
  src?: string;
  reservationLinks?: ReservationLink[];
};
export default function PrescriptionSection({ src, reservationLinks }: Props) {
  const computedSrc = src ?? (reservationLinks || []).find((l) => l.type === "Rezeptbestellung")?.url;
  if (!computedSrc) return null;
  return (
    <>
      <Divider addClass="my-4" />
      <section className="flex flex-col items-center space-y-4">
        <div className="flex flex-row justify-center align-middle font-semibold text-primary text-2xl text-center">
          <ClipboardPlus className="self-center mr-2" /><span className="mr-1">Rezept</span>
        </div>
        <div className="flex align-middle w-full mb-8">
          <Link
            href={computedSrc}
            target="_self"
            className="btn btn-primary text-lg mx-auto flex gap-2 rounded"
          >
            <ClipboardPlus /> <span>online Rezept</span>
          </Link>
        </div>
      </section>
    </>
  );
}