'use client';

import { Navigation, NavigationOff, Phone } from 'lucide-react';

import type { Schedule } from '@/utils/types';
import type { MySmartHealthFormLocation } from './mshFormSanitizers';

import Divider from '@/components/divider/Divider';
import { AddressSection } from '@/components/profile/edit-profile-form/_components/AddressSection';
import { PhoneNumbersSection } from '@/components/profile/edit-profile-form/_components/PhoneNumbersSection';
import { WorkScheduleSection } from '@/components/profile/edit-profile-form/_components/WorkScheduleSection';


type MSHLocationSectionProps = {
  locations: MySmartHealthFormLocation[];
  setLocationsAction: (locations: MySmartHealthFormLocation[]) => void;
  mySmartHealthId: string;
};

export function MSHLocationSection({
  locations,
  setLocationsAction,
  mySmartHealthId,
}: MSHLocationSectionProps) {
  const addLocation = () => {
    setLocationsAction([
      ...locations,
      {
        id: crypto.randomUUID(),
        address: '',
        phone: [],
        schedule: [] as Schedule[],
        mySmartHealthId,
      },
    ]);
  };

  const updateLocation = (
    index: number,
    field: keyof MySmartHealthFormLocation,
    value: string | string[] | Schedule[]
  ) => {
    const newLocations = [...locations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    setLocationsAction(newLocations);
  };

  const removeLocation = (index: number) => {
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

  const toggleScheduleDay = (
    locationIdx: number,
    scheduleId: string,
    day: keyof Schedule['day']
  ) => {
    const location = locations[locationIdx];
    const updatedSchedule = Array.isArray(location.schedule)
      ? location.schedule
        .filter(isSchedule)
        .map((s) =>
          s.id === scheduleId ? { ...s, day: { ...s.day, [day]: !s.day[day] } } : s
        )
      : [];
    updateLocationSchedule(locationIdx, updatedSchedule);
  };

  const setScheduleTime = (
    locationIdx: number,
    scheduleId: string,
    openClose: keyof Schedule,
    value: string
  ) => {
    const location = locations[locationIdx];
    const updatedSchedule = Array.isArray(location.schedule)
      ? location.schedule
        .filter(isSchedule)
        .map((s) => (s.id === scheduleId ? { ...s, [openClose]: value } : s))
      : [];
    updateLocationSchedule(locationIdx, updatedSchedule);
  };

  return (
    <section className="mb-4">
      {locations.map((location, index) => (
        <div key={location.id} className="border border-primary rounded p-4 mb-4">
          <AddressSection
            address={location.address}
            setAddressAction={(value) => updateLocation(index, 'address', value[0] || '')}
          />

          <Divider addClass="my-1" />

          <PhoneNumbersSection
            phoneNumbers={location.phone}
            setPhoneNumbers={(value) => updateLocation(index, 'phone', value)}
            platformIcon={<Phone className="inline-block mr-1" size={20} />}
          />

          <Divider addClass="my-1" />

          <WorkScheduleSection
            schedule={Array.isArray(location.schedule) ? location.schedule.filter(isSchedule) : []}
            setSchedule={(value) => updateLocation(index, 'schedule', value)}
            toggleScheduleDay={(scheduleId, day) => toggleScheduleDay(index, scheduleId, day)}
            setScheduleTime={(scheduleId, openClose, value) => setScheduleTime(index, scheduleId, openClose, value)}
          />

          <Divider addClass="my-1" />

          <button
            type="button"
            onClick={() => removeLocation(index)}
            className="btn btn-outline w-full flex place-self-end mt-4 align-bottom text-red-500"
          >
            <NavigationOff /> Remove Location
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
