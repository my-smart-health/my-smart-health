'use client';
import { useState } from "react";

import { MySmartHealthInfo } from "@/utils/types";

import MSHParagraph from "./MSHParagraph";
import MSHGeneralTitle from "./MSHGeneralTitle";
import { MSHLocationSection } from "./MSHLocationSection";
import Divider from "@/components/divider/Divider";
import StatusModal from "@/components/modals/status-modal/StatusModal";
import { useRouter } from "next/navigation";
import {
  buildMySmartHealthPayload,
  sanitizeLocationsForPersistence,
  MySmartHealthFormLocation,
} from "./mshFormSanitizers";

export default function MySmartHealthForm({ smartHealthData, initialLocations }: { smartHealthData: MySmartHealthInfo | null; initialLocations: MySmartHealthFormLocation[] }) {

  const [generalTitle, setGeneralTitle] = useState(smartHealthData?.generalTitle || "");
  const [paragraphs, setParagraphs] = useState(smartHealthData?.paragraph || []);
  const [locations, setLocations] = useState<MySmartHealthFormLocation[]>(initialLocations || []);
  const router = useRouter();
  const [error, setError] = useState<{ message: string, type: 'success' | 'error' | 'warning' } | null>(null);

  const handleUpdateParagraphsInDB = async (updatedParagraphs: typeof paragraphs) => {
    try {
      const payload = buildMySmartHealthPayload({
        id: smartHealthData?.id,
        generalTitle,
        paragraphs: updatedParagraphs,
      });

      if (!payload.generalTitle) {
        return;
      }

      const response = await fetch("/api/update/update-my-smart-health", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setError({ message: 'Failed to auto-save paragraphs. Your changes may not be saved.', type: 'error' });
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to auto-save paragraphs to database');
        }
      }
    } catch (error) {
      setError({ message: 'Error saving paragraphs. Please try again or contact support.', type: 'error' });
      if (process.env.NODE_ENV === 'development') {
        console.error('Error auto-saving paragraphs:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const payload = buildMySmartHealthPayload({
        id: smartHealthData?.id,
        generalTitle,
        paragraphs,
      });

      if (!payload.generalTitle) {
        setError({ message: 'General title is required.', type: 'error' });
        return;
      }

      const sanitizedLocations = sanitizeLocationsForPersistence(locations);

      const locationWithMissingAddress = sanitizedLocations.find((location) => !location.address);
      if (locationWithMissingAddress) {
        setError({ message: 'Each location must include an address.', type: 'error' });
        return;
      }

      const response = await fetch("/api/update/update-my-smart-health", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError({ message: errorData.error || "Failed to update information", type: 'error' });
        return;
      }

      const updateResult = await response.json().catch(() => null);
      const persistedRecordId =
        (updateResult?.data?.id as string | undefined) ?? smartHealthData?.id ?? undefined;

      const resolvedLocations = sanitizedLocations.map((location) => ({
        ...location,
        mySmartHealthId: location.mySmartHealthId || persistedRecordId,
      }));

      if (!persistedRecordId && resolvedLocations.some((location) => !location.mySmartHealthId)) {
        setError({ message: 'Unable to resolve My Smart Health record. Please try again.', type: 'error' });
        return;
      }

      const existingIds = initialLocations.map(l => l.id);
      const sanitizedIds = resolvedLocations.map(l => l.id);

      for (const id of existingIds) {
        if (!sanitizedIds.includes(id)) {
          await fetch(`/api/msh/locations/${id}`, { method: 'DELETE' });
        }
      }

      for (const location of resolvedLocations) {
        const schedulePayload = Array.isArray(location.schedule) && location.schedule.length > 0
          ? location.schedule
          : null;

        if (existingIds.includes(location.id)) {
          await fetch(`/api/msh/locations/${location.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              address: location.address,
              phone: location.phone,
              schedule: schedulePayload,
            }),
          });
        } else {
          if (!location.mySmartHealthId) {
            continue;
          }
          await fetch('/api/msh/locations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              address: location.address,
              phone: location.phone,
              schedule: schedulePayload,
              mySmartHealthId: location.mySmartHealthId,
            }),
          });
        }
      }

      setError({ message: "Information updated successfully", type: 'success' });
      router.push("/smart-health");
      router.refresh();
    } catch (err) {
      setError({ message: `An error occurred while updating the information ${err}`, type: 'error' });
    }
  }

  return (
    <>
      <form className="flex flex-col gap-4">
        <button type="button" onClick={handleSubmit} className="mt-4 btn btn-primary bg-green-500 hover:bg-green-500/75">Update</button>
        <MSHGeneralTitle generalTitle={generalTitle} setGeneralTitleAction={setGeneralTitle} />

        <Divider />

        <MSHParagraph
          paragraphs={paragraphs}
          setParagraphsAction={setParagraphs}
          setErrorAction={setError}
          onAfterChange={handleUpdateParagraphsInDB}
        />

        <Divider />

        <MSHLocationSection
          locations={locations}
          setLocationsAction={setLocations}
          mySmartHealthId={smartHealthData?.id || ''}
        />

        <button type="button" onClick={handleSubmit} className="mt-4 btn btn-primary bg-green-500 hover:bg-green-500/75">Update</button>
      </form>

      <StatusModal
        isOpen={!!error}
        onCloseAction={() => setError(null)}
        message={error?.message || ""}
        type={error?.type || "success"}
      />
    </>
  );
}