import Image from "next/image";
import Divider from "@/components/divider/Divider";
import MoveImageVideo from "@/components/buttons/move-up-down-image-video/MoveImageVideo";
import { CertificateForm } from "@/utils/types";
import Spinner from "@/components/common/Spinner";
import { useState } from "react";

type CertificatesSectionProps = {
  certificates: CertificateForm[];
  setCertificates: React.Dispatch<React.SetStateAction<CertificateForm[]>>;
  handleRemoveImage: (
    imageUrl: string,
    setCertificates: React.Dispatch<React.SetStateAction<CertificateForm[]>>
  ) => Promise<void>;
  handleUploadCertificate: (e: React.ChangeEvent<HTMLInputElement>, files: File[]) => Promise<string[]>;
};

export function CertificatesSection({
  certificates,
  setCertificates,
  handleRemoveImage,
  handleUploadCertificate,
}: CertificatesSectionProps) {
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [deletingIdx, setDeletingIdx] = useState<number | null>(null);
  return (
    <section>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Certificates</legend>
        <div className="flex flex-col gap-4 w-full">
          {certificates.map((cert, idx) => (
            <div key={cert.id || idx} className="flex flex-col gap-4 border border-primary rounded p-4 relative">
              <button
                type="button"
                disabled={deletingIdx === idx}
                onClick={async () => {
                  const fileName = cert.name || `certificate ${idx + 1}`;
                  const confirmDelete = window.confirm(`Delete certificate "${fileName}" and its images?`);
                  if (!confirmDelete) return;
                  try {
                    setDeletingIdx(idx);
                    if (cert.images && cert.images.length > 0) {
                      await Promise.all(
                        cert.images.map(imageURL => handleRemoveImage(imageURL, setCertificates))
                      );
                    }
                    setCertificates(certificates.filter((_, i) => i !== idx));
                  } finally {
                    setDeletingIdx(null);
                  }
                }}
                className="relative top-2 right-2 self-end btn btn-circle btn-error hover:bg-red-600/70 text-white font-bold text-lg disabled:opacity-50"
                aria-label="Remove certificate"
                title="Remove certificate"
              >
                {deletingIdx === idx ? <Spinner size="sm" colorClass="text-white" /> : '\u00d7'}
              </button>
              <div className="flex flex-col gap-2">
                <label className="flex flex-col gap-2">
                  <span className="font-semibold text-gray-700">Certificate Name</span>
                  <input
                    type="text"
                    name={`certificates[${idx}].name`}
                    value={cert.name}
                    required
                    placeholder="e.g. Certificate for ..."
                    onChange={e => {
                      const updated = [...certificates];
                      updated[idx].name = e.target.value;
                      setCertificates(updated);
                    }}
                    className="required: p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="font-semibold text-gray-700">Issuer</span>
                  <input
                    type="text"
                    name={`certificates[${idx}].issuer`}
                    value={cert.issuer}
                    required
                    placeholder="e.g. Issued by ..."
                    onChange={e => {
                      const updated = [...certificates];
                      updated[idx].issuer = e.target.value;
                      setCertificates(updated);
                    }}
                    className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                  />
                </label>
                <div className="flex flex-col gap-4">
                  <label className="flex flex-col gap-2 flex-1">
                    <span className="font-semibold text-gray-700">Issue Date</span>
                    <input
                      type="date"
                      name={`certificates[${idx}].issueDate`}
                      value={cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : ""}
                      required
                      onChange={e => {
                        const updated = [...certificates];
                        updated[idx].issueDate = e.target.value ? new Date(e.target.value) : new Date();
                        setCertificates(updated);
                      }}
                      className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-fit"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <div className="flex flex-row items-center gap-2 font-semibold text-gray-700">
                      <span>Expiry Date</span>
                      <input
                        type="checkbox"
                        checked={!!cert.expiryDate}
                        onChange={e => {
                          const updated = [...certificates];
                          if (e.target.checked) {
                            updated[idx].expiryDate = new Date();
                          } else {
                            updated[idx].expiryDate = null;
                          }
                          setCertificates(updated);
                        }}
                        className="checkbox checkbox-primary m-0 p-1"
                      />
                      <span className="text-xs font-normal text-gray-500">Enable</span>
                    </div>
                    {cert.expiryDate && (
                      <input
                        type="date"
                        name={`certificates[${idx}].expiryDate`}
                        value={cert.expiryDate ? new Date(cert.expiryDate).toISOString().split('T')[0] : ""}
                        onChange={e => {
                          const updated = [...certificates];
                          updated[idx].expiryDate = e.target.value ? new Date(e.target.value) : null;
                          setCertificates(updated);
                        }}
                        className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-fit"
                      />
                    )}
                  </label>
                </div>
                <label className="flex flex-col gap-2">
                  <div className="flex flex-row items-center gap-2 font-semibold text-gray-700">
                    <span>Credential ID</span>
                    <input
                      type="checkbox"
                      checked={cert.credentialId !== null && cert.credentialId !== undefined}
                      onChange={e => {
                        const updated = [...certificates];
                        if (e.target.checked) {
                          updated[idx].credentialId = '';
                        } else {
                          updated[idx].credentialId = null;
                        }
                        setCertificates(updated);
                      }}
                      className="checkbox checkbox-primary m-0 p-1"
                    />
                    <span className="text-xs font-normal text-gray-500">Enable</span>
                  </div>
                  {(cert.credentialId !== null && cert.credentialId !== undefined) && (
                    <input
                      type="text"
                      name={`certificates[${idx}].credentialId`}
                      value={cert.credentialId}
                      placeholder="e.g. 123-ABC-456"
                      onChange={e => {
                        const updated = [...certificates];
                        updated[idx].credentialId = e.target.value;
                        setCertificates(updated);
                      }}
                      className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                    />
                  )}
                </label>
                <label className="flex flex-col gap-2">
                  <span className="font-semibold text-gray-700">Credential URL</span>
                  <input
                    type="url"
                    name={`certificates[${idx}].credentialUrl`}
                    value={cert.credentialUrl || ''}
                    onChange={e => {
                      const updated = [...certificates];
                      updated[idx].credentialUrl = e.target.value || null;
                      setCertificates(updated);
                    }}
                    className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
                  />
                </label>

                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-gray-700">Certificate Images</span>
                  <div className="flex flex-col gap-4">
                    {cert.images && cert.images.length > 0 ? (
                      cert.images.map((imgUrl, imgIdx) => (
                        <div key={imgUrl + imgIdx} className="flex items-center gap-4">
                          <div className="relative w-[100px] h-[100px]">
                            <Image
                              src={imgUrl}
                              loading="lazy"
                              placeholder="empty"
                              alt={`Certificate ${idx + 1} Image ${imgIdx + 1}`}
                              fill
                              sizes="100px"
                              className="rounded border border-primary object-contain"
                            />
                          </div>
                          <MoveImageVideo
                            index={imgIdx}
                            blobResult={cert.images}
                            setBlobResultAction={newArr => {
                              const updated = [...certificates];
                              updated[idx].images = newArr;
                              setCertificates(updated);
                            }}
                            showTop={imgIdx > 0}
                            showBottom={imgIdx < cert.images.length - 1}
                            removeAddress={`/api/delete/delete-picture?url=${encodeURIComponent(imgUrl)}`}
                          />
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">No images attached</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="file-input file-input-bordered file-input-primary w-full mt-2"
                    onChange={async e => {
                      if (!e.target.files) return;
                      setUploadingIdx(idx);
                      const uploaded = await handleUploadCertificate(e, Array.from(e.target.files));
                      if (uploaded.length) {
                        const updated = [...certificates];
                        updated[idx].images = [...(updated[idx].images || []), ...uploaded];
                        setCertificates(updated);
                      }
                      setUploadingIdx(null);
                      e.target.value = "";
                    }}
                  />
                  {uploadingIdx === idx && (
                    <div className="mt-2"><Spinner size="sm" label="Uploading certificate images..." /></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <Divider addClass="my-1" />
        <button
          type="button"
          onClick={() => setCertificates([
            ...certificates,
            {
              name: '',
              issuer: '',
              images: [],
              issueDate: new Date(),
              expiryDate: null,
              credentialId: null,
              credentialUrl: null,
            }
          ])}
          className="btn btn-outline btn-primary w-full mt-2 px-3 py-1 rounded"
        >
          + Add Certificate
        </button>
        <Divider addClass="my-1" />
      </fieldset>
    </section>
  );
}