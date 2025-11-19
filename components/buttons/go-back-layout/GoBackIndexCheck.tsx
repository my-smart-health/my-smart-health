'use client';
import GoBack from "@/components/buttons/go-back/GoBack";
import { usePathname } from "next/navigation";

export default function GoBackIndexCheck() {
  const pathname = usePathname() || "";
  const isIndex = pathname === "/" || pathname === "/index";

  return (
    <>
      {!isIndex ? (
        <div className="self-end my-2">
          <GoBack />
        </div>
      ) : null}
    </>
  );
}