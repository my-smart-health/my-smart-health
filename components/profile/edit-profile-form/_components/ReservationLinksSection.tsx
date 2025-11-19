"use client";

import { ReservationLink, RESERVATION_LINK_TYPES, ReservationLinkType } from "@/utils/types";
import Divider from "@/components/divider/Divider";
import { NotebookTabs } from "lucide-react";

type Props = {
  reservationLinks: ReservationLink[];
  onChange: (links: ReservationLink[]) => void;
};

export default function ReservationLinksSection({ reservationLinks, onChange }: Props) {

  const handleAdd = () => {
    const next: ReservationLink = {
      id: crypto.randomUUID(),
      type: RESERVATION_LINK_TYPES.OnlineTermine,
      url: "",
    };
    onChange([...(reservationLinks || []), next]);
  };

  const handleUpdate = (id: string, patch: Partial<ReservationLink>) => {
    const updated = (reservationLinks || []).map((link) => (link.id === id ? { ...link, ...patch } : link));
    onChange(updated);
  };

  const handleRemove = (id: string) => {
    if (!confirm("Diesen Link wirklich entfernen?")) return;
    onChange((reservationLinks || []).filter((link) => link.id !== id));
  };

  return (
    <section className="space-y-4">
      {!reservationLinks.length && (
        <span className="font-semibold text-gray-700">Reservierungen/Rezepte</span>
      )}

      {(reservationLinks || []).map((link) => (
        <div className="flex flex-col gap-2" key={link.id}>
          <span className="font-semibold text-gray-700">Link</span>
          <div className="flex flex-col md:flex-row gap-2">
            <label className="form-control w-full md:w-60">
              <div className="label">
                <span className="label-text">Type</span>
              </div>
              <select
                className="select select-lg select-bordered select-primary w-full max-w-xs border-primary"
                value={link.type}
                onChange={(e) => handleUpdate(link.id, { type: e.target.value as ReservationLinkType })}
              >
                {Object.values(RESERVATION_LINK_TYPES).map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">{link.type === RESERVATION_LINK_TYPES.Email ? "E-Mail" : "URL"}</span>
              </div>
              <input
                type={link.type === RESERVATION_LINK_TYPES.Email ? "email" : "url"}
                placeholder={link.type === RESERVATION_LINK_TYPES.Email ? "name@example.com" : "https://..."}
                className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                value={link.url}
                autoComplete={link.type === RESERVATION_LINK_TYPES.Email ? "email" : "url"}
                inputMode={link.type === RESERVATION_LINK_TYPES.Email ? "email" : "url"}
                onChange={(e) => handleUpdate(link.id, { url: e.target.value })}
              />
            </label>
          </div>

          <button
            type="button"
            className="btn btn-outline flex place-self-end mt-2 w-fit align-bottom text-red-500"
            onClick={() => handleRemove(link.id)}
          >
            Remove
          </button>
          <Divider addClass="my-1" />
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="btn btn-outline btn-primary px-3 py-1 h-auto w-full"
      >
        <NotebookTabs /> Add Link Reservierungen/Rezepte
      </button>
    </section>
  );
}