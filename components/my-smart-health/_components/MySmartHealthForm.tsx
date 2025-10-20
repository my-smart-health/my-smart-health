'use client';
import { useState } from "react";

import { MySmartHealthInfo } from "@/utils/types";

import MSHParagraph from "./MSHParagraph";
import MSHGeneralTitle from "./MSHGeneralTitle";
import Divider from "@/components/divider/Divider";
import StatusModal from "@/components/modals/status-modal/StatusModal";
import { useRouter } from "next/navigation";

export default function MySmartHealthForm({ smartHealthData }: { smartHealthData: MySmartHealthInfo | null }) {

  const [generalTitle, setGeneralTitle] = useState(smartHealthData?.generalTitle || "");
  const [paragraphs, setParagraphs] = useState(smartHealthData?.paragraph || []);
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
      } else {
        setError({ message: "Information updated successfully", type: 'success' });
        router.refresh();
        router.push("/smart-health");
      }
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