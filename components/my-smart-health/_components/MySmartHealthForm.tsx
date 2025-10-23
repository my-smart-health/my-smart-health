'use client';
import { useState } from "react";

import { MySmartHealthInfo, Schedule } from "@/utils/types";

import MSHParagraph from "./MSHParagraph";
import MSHGeneralTitle from "./MSHGeneralTitle";
import { MSHLocationSection } from "./MSHLocationSection";
import Divider from "@/components/divider/Divider";
import StatusModal from "@/components/modals/status-modal/StatusModal";
import { useRouter } from "next/navigation";

type MSHLocation = {
  id: string;
  address: string;
  phone: string[];
  schedule: Schedule[] | null;
  mySmartHealthId?: string | null;
};

export default function MySmartHealthForm({ smartHealthData, initialLocations }: { smartHealthData: MySmartHealthInfo | null; initialLocations: MSHLocation[] }) {

  const [generalTitle, setGeneralTitle] = useState(smartHealthData?.generalTitle || "");
  const [paragraphs, setParagraphs] = useState(smartHealthData?.paragraph || []);
  const [locations, setLocations] = useState<MSHLocation[]>(initialLocations || []);
  const router = useRouter();
  const [error, setError] = useState<{ message: string, type: 'success' | 'error' | 'warning' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/update/update-my-smart-health", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: smartHealthData?.id,
          generalTitle,
          paragraph: paragraphs,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError({ message: errorData.error || "Failed to update information", type: 'error' });
        return;
      }

      const existingIds = initialLocations.map(l => l.id);
      const currentIds = locations.map(l => l.id);

      for (const id of existingIds) {
        if (!currentIds.includes(id)) {
          await fetch(`/api/msh/locations/${id}`, { method: 'DELETE' });
        }
      }

      for (const location of locations) {
        if (existingIds.includes(location.id)) {
          await fetch(`/api/msh/locations/${location.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              address: location.address,
              phone: location.phone,
              schedule: location.schedule,
            }),
          });
        } else {
          await fetch('/api/msh/locations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              address: location.address,
              phone: location.phone,
              schedule: location.schedule,
              mySmartHealthId: smartHealthData?.id,
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