import { Certificates } from "@/utils/types";
import Image from "next/image";

export default function CertificateList({ certificates }: { certificates: Certificates[] }) {
  if (!certificates || certificates.length === 0) {
    return null;
  }

  return (
    <ul className="list-disc pl-5">
      {certificates.map((cert, index) => (
        <li key={index} className="text-gray-700">
          <div className="font-bold">{cert.name}</div>
          <section>
            {cert.imageUrl && cert.imageUrl.map((url, idx) => (
              <Image key={idx}
                src={url}
                alt={`Certificate ${cert.name}`}
                width={200}
                height={100}
                style={{ objectFit: "contain", width: "auto", height: "auto" }}
                className="my-2 rounded-lg border border-primary shadow-md"
              />
            ))}
          </section>
          <div className="text-sm text-gray-500">Issued by: {cert.issuedBy}</div>
          <div className="text-sm text-gray-500">Date issued: {cert.dateIssued.toLocaleDateString()}</div>
          <div className="text-sm text-gray-500">Valid until: {cert.validUntil.toLocaleDateString()}</div>
        </li>
      ))}
    </ul>
  );
}