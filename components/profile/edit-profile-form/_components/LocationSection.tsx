import Divider from "@/components/divider/Divider";
import { AddressSection } from "./AddressSection";
import { PhoneNumbersSection } from "./PhoneNumbersSection";
import { Navigation, NavigationOff, Phone } from "lucide-react";
import { WorkScheduleSection } from "./WorkScheduleSection";
import type { Schedule, Location, ReservationLink } from "@/utils/types";
import ReservationLinksSection from "./ReservationLinksSection";

type LocationProps = {
  locations: Location[] | [];
  setLocationsAction: (locations: Location[]) => void;
  profileId: string;
  addressRef?: React.RefObject<HTMLTextAreaElement | null>;
}

export function LocationSection({ locations, setLocationsAction, profileId, addressRef }: LocationProps) {

  const addLocation = () => {
    setLocationsAction([
      ...locations,
      {
        id: crypto.randomUUID(),
        address: "",
        phone: [],
        userId: profileId,
        schedule: [] as Schedule[],
        reservationLinks: [] as ReservationLink[],
      } as Location
    ]);
  };

  const updateLocation = (index: number, field: keyof Location, value: string | string[] | Schedule[] | ReservationLink[]) => {
    const newLocations = [...locations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    setLocationsAction(newLocations);
  };

  const removeLocation = (index: number) => {
    if (!confirm("Are you sure you want to remove this location?")) return;
    const newLocations = locations.filter((_, i) => i !== index);
    setLocationsAction(newLocations);
  };

  function isSchedule(obj: Schedule) {
    return obj && typeof obj === 'object' && 'id' in obj && 'day' in obj && 'open' in obj && 'close' in obj;
  }

  const updateLocationSchedule = (index: number, newSchedule: Schedule[]) => {
    const newLocations = [...locations];
    newLocations[index] = { ...newLocations[index], schedule: newSchedule };
    setLocationsAction(newLocations);
  };

  const toggleScheduleDay = (locationIdx: number, scheduleId: string, day: keyof Schedule['day']) => {
    const location = locations[locationIdx];
    const updatedSchedule = Array.isArray(location.schedule)
      ? location.schedule
        .filter(isSchedule)
        .map(scheduleItem =>
          scheduleItem.id === scheduleId ? { ...scheduleItem, day: { ...scheduleItem.day, [day]: !scheduleItem.day[day] } } : scheduleItem
        )
      : [];
    updateLocationSchedule(locationIdx, updatedSchedule);
  };

  const setScheduleTime = (locationIdx: number, scheduleId: string, openClose: keyof Schedule, value: string) => {
    const location = locations[locationIdx];
    const updatedSchedule = Array.isArray(location.schedule)
      ? location.schedule
        .filter(isSchedule)
        .map(scheduleItem =>
          scheduleItem.id === scheduleId ? { ...scheduleItem, [openClose]: value } : scheduleItem
        )
      : [];
    updateLocationSchedule(locationIdx, updatedSchedule);
  };

  return (
    <section className="mb-4">

      {locations.map((location, index) => (
        <div key={location.id} className="border odd:border-primary odd:bg-primary/10 even:border-yellow-500 even:bg-yellow-50 rounded p-4 mb-4">
          <AddressSection address={location.address} setAddressAction={(value) => updateLocation(index, "address", value)} addressRef={addressRef} />

          <Divider addClass="my-1" />

          <PhoneNumbersSection
            phoneNumbers={location.phone}
            setPhoneNumbers={(value) => updateLocation(index, "phone", value)}
            platformIcon={<Phone className="inline-block mr-1" size={20} />}
          />

          <Divider addClass="my-1" />

          <WorkScheduleSection
            schedule={Array.isArray(location.schedule) ? location.schedule.filter(isSchedule) : []}
            setSchedule={(value) => updateLocation(index, "schedule", value)}
            toggleScheduleDay={(scheduleId, day) => toggleScheduleDay(index, scheduleId, day)}
            setScheduleTime={(scheduleId, openClose, value) => setScheduleTime(index, scheduleId, openClose, value)}
          />

          <Divider addClass="my-1" />

          <ReservationLinksSection
            reservationLinks={location.reservationLinks || []}
            onChange={(links) => updateLocation(index, "reservationLinks", links)}
          />

          <Divider addClass="my-1" />

          <button
            type="button"
            onClick={() => removeLocation(index)}
            className="btn btn-outline w-full flex place-self-end mt-4 align-bottom text-red-500"
          >
            <NavigationOff />  Remove Location
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addLocation}
        className="btn btn-primary w-full flex place-self-end mt-4 align-bottom"
      >
        <Navigation /> Add Location
      </button>

    </section>
  );
}