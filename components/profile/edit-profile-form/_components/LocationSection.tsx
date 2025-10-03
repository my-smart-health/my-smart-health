import Divider from "@/components/divider/Divider";
import { AddressSection } from "./AddressSection";
import { PhoneNumbersSection } from "./PhoneNumbersSection";
import { Location } from "@prisma/client";
import { Phone } from "lucide-react";

type LocationProps = {
  locations: Location[] | [];
  setLocationsAction: (locations: Location[]) => void;
  profileId: string;
  addressRef?: React.RefObject<HTMLTextAreaElement | null>;
}

export default function LocationSection({ locations, setLocationsAction, profileId, addressRef }: LocationProps) {
  const addLocation = () => {
    setLocationsAction([
      ...locations,
      {
        id: crypto.randomUUID(),
        address: "",
        phone: [],
        userId: profileId
      } as Location
    ]);
  };
  const updateLocation = (index: number, field: keyof Location, value: string | string[]) => {
    const newLocations = [...locations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    setLocationsAction(newLocations);
  };
  const removeLocation = (index: number) => {
    const newLocations = locations.filter((_, i) => i !== index);
    setLocationsAction(newLocations);
  };

  return (
    <section className="mb-4">

      {locations.map((location, index) => (
        <div key={location.id} className="border border-primary rounded p-4 mb-4">
          <AddressSection address={location.address} setAddressAction={(value) => updateLocation(index, "address", value)} addressRef={addressRef} />

          <Divider addClass="my-4" />

          <PhoneNumbersSection
            phoneNumbers={location.phone}
            setPhoneNumbers={(value) => updateLocation(index, "phone", value)}
            platformIcon={<Phone className="inline-block mr-1" size={20} />}
          />

          <Divider addClass="my-4" />

          <button
            type="button"
            onClick={() => removeLocation(index)}
            className="btn btn-outline w-full flex place-self-end mt-4 align-bottom text-red-500"
          >
            Remove Location
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addLocation}
        className="btn btn-primary w-full flex place-self-end mt-4 align-bottom"
      >
        Add Location
      </button>

    </section>
  );
} 