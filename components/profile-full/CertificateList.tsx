import { Certificate } from "@/utils/types";
import Image from "next/image";

export default function CertificateList({ certificates }: { certificates: Certificate[] }) {
  if (!certificates || certificates.length === 0) {
    return null;
  }

  return (
    <ul className="list-disc pl-5">
      {certificates.map((cert) => {
        if (!cert) return null;
        const { id, name, issuer, issueDate, expiryDate, credentialId, images } = cert;

        const formattedIssueDate = new Date(issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        const formattedExpiryDate = expiryDate ? new Date(expiryDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
        return (
          <section key={id}>
            <h3 className="font-semibold">{name}</h3>
            <p>Issuer: {issuer}</p>
            <p>Issue Date: {formattedIssueDate}</p>
            <p>Expiry Date: {formattedExpiryDate}</p>
            <p>Credential ID: {credentialId}</p>
            {images && images.length > 0 && (
              <div className="flex gap-2">
                {images.map((image, idx) => (
                  <Image
                    key={idx}
                    src={image}
                    alt={`Certificate Image ${idx}`}
                    width={100}
                    height={100}
                    style={{ objectFit: "contain", width: "auto", height: "auto" }}
                    loading="lazy"
                    placeholder="empty" />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </ul>
  );
}