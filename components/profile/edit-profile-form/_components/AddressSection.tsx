import React, { RefObject } from "react";

type AddressSectionProps = {
  address: string;
  setAddressAction: (val: string[]) => void;
  addressRef?: RefObject<HTMLTextAreaElement | null>;
};

export function AddressSection({ address, setAddressAction, addressRef }: AddressSectionProps) {
  return (
    <section className="space-y-4">
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-gray-700">Address</span>
        <textarea
          name="address"
          ref={addressRef}
          value={address}
          onChange={e => {
            setAddressAction([e.target.value]);
          }}
          className="p-3 rounded border border-primary focus:outline-none focus:ring-2 focus:ring-primary w-full min-h-[80px]"
          rows={1}
        />
      </label>

    </section>
  );
}
