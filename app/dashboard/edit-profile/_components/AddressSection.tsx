import React, { RefObject } from "react";

type AddressSectionProps = {
  address: string;
  setAddress: (val: string) => void;
  addressRef?: RefObject<HTMLTextAreaElement | null>;
};

export function AddressSection({ address, setAddress, addressRef }: AddressSectionProps) {
  return (
    <section>
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-gray-700">Address</span>
        <textarea
          name="address"
          ref={addressRef}
          value={address}
          onChange={e => setAddress(e.target.value)}
          className="p-3 rounded border border-primary focus:outline-none focus:ring-2 focus:ring-primary w-full min-h-[80px]"
          rows={1}
        />
      </label>
    </section>
  );
}