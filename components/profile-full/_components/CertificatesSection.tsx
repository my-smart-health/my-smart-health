import { Certificate } from "@/utils/types";

import Divider from "@/components/divider/Divider";
import CertificateList from "./CertificateList";

export default function CertificatesSection({ certificates }: { certificates: Certificate[] }) {
  if (!certificates?.length) return null;
  return (
    <>
      <Divider />
      <section>
        <h2 className="font-bold text-primary text-xl">Zertifikate</h2>
        <CertificateList certificates={certificates} />
      </section>
    </>
  );
}