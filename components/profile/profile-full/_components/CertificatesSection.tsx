import Image from "next/image";
import { Suspense, useState } from "react";

import { Certificate } from "@/utils/types";
import Divider from "@/components/divider/Divider";

export default function CertificatesSection({ certificates }: { certificates: Certificate[] }) {
  const [zoomedSrc, setZoomedSrc] = useState<string | null>(null);

  if (!certificates || certificates.length === 0) {
    return null;
  }

  return (
    <>
      <Divider />
      <section>
        <h2 className="font-bold text-primary text-2xl mb-6 text-center">Zertifikate</h2>
        <Suspense fallback={<div className="skeleton animate-pulse h-[350px] w-full mb-6 bg-gray-200 rounded-lg"></div>}>
          <div className="grid grid-cols-1 gap-8">
            {certificates.map((cert) => {
              if (!cert) return null;
              const { id, name, issuer, issueDate, expiryDate, credentialId, images } = cert;
              const formattedIssueDate = new Date(issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
              const formattedExpiryDate = expiryDate ? new Date(expiryDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

              return (
                <div
                  key={id}
                  className="bg-white p-6 flex flex-col items-center"
                >
                  {images && images.length > 0 && (
                    <div className="flex flex-row flex-wrap gap-4 justify-center mb-4">
                      {images.map((image, idx) => (
                        <Image
                          key={idx}
                          src={image}
                          alt={`Certificate Image ${idx}`}
                          width={180}
                          height={180}
                          style={{ objectFit: "contain", width: "180px", height: "180px" }}
                          loading="lazy"
                          placeholder="empty"
                          className="rounded-lg border-2 border-gold shadow-md cursor-zoom-in hover:scale-105 transition-transform duration-200"
                          onClick={e => {
                            e.preventDefault();
                            setZoomedSrc(image);
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <h3 className="font-semibold text-lg text-primary mb-1 text-center">{name}</h3>
                  <p className="mb-1 text-gray-700 text-center"><span className="font-medium">Ausgestellt von:</span> {issuer}</p>
                  <p className="mb-1 text-gray-700 text-center"><span className="font-medium">Ausstellungsdatum:</span> {formattedIssueDate}</p>
                  <p className="mb-1 text-gray-700 text-center"><span className="font-medium">Ablaufdatum:</span> {formattedExpiryDate}</p>
                  {credentialId && (
                    <p className="mb-1 text-gray-700 text-center"><span className="font-medium">Zertifikats-ID:</span> {credentialId}</p>
                  )}
                </div>
              );
            })}
          </div>
        </Suspense>
      </section>
      <br />
      {zoomedSrc !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity cursor-zoom-out"
          onClick={() => setZoomedSrc(null)}
        >
          <div
            className="relative max-w-3xl w-full flex justify-center items-center cursor-zoom-out"
            onClick={e => { e.stopPropagation(); setZoomedSrc(null); }}
          >
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold z-10 cursor-pointer"
              onClick={() => setZoomedSrc(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="relative w-full h-[60vh] md:h-[80vh]">
              <Image
                loading="eager"
                placeholder="empty"
                src={zoomedSrc}
                alt={`Zoomed photo ${zoomedSrc}`}
                fill
                style={{ objectFit: "contain" }}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}