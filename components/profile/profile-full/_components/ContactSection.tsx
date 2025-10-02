import Link from "next/link";
import { MapPin } from "lucide-react";
import Divider from "@/components/divider/Divider";

export default function ContactSection({
  phone,
  displayEmail,
  website,
  parsedSocials,
  address,
  platformIcons,
}: {
  phone: string[];
  displayEmail: string | null;
  website: string | null;
  parsedSocials: { platform: string; url: string }[];
  address: string | null;
  platformIcons: Record<string, React.ReactNode>;
}) {
  if (!phone?.length && !displayEmail && !website && (!parsedSocials || parsedSocials.length === 0) && !address) {
    return null;
  }
  return (
    <>
      <Divider addClass="my-4" />

      <section className="grid grid-cols-1 gap-3">
        <h2 className="font-bold text-primary text-xl">Kontakt</h2>
        {phone && phone.length > 0 && (
          phone.map((phone, idx) => (
            <Link
              key={idx}
              href={`tel:${phone}`}
              target="_blank"
              className="text-gray-700 w-fit hover:text-primary transition-colors duration-200 link">
              <span className="mr-1">{platformIcons.Phone}</span>{phone}
            </Link>
          )))}
        {displayEmail && (
          <Link
            href={`mailto:${displayEmail}`}
            className="text-gray-700 w-fit hover:text-primary transition-colors duration-200 break-all break-before-left link">
            <span className="mr-1">{platformIcons.Email}</span>{displayEmail}
          </Link>
        )}
        {website && (
          <Link
            href={website}
            target="_blank"
            className="text-gray-700 w-fit hover:text-primary transition-colors duration-200 break-all break-before-left link">
            <span className="mr-1">{platformIcons.Website}</span>{website}
          </Link>
        )}
        {parsedSocials.length > 0 && parsedSocials.map((social, idx) => (
          <div key={social.url + idx} className="flex items-center w-full h-auto my-auto">
            <Link
              href={social.url}
              target="_blank"
              className="flex justify-center items-center text-gray-700 hover:text-primary transition-colors duration-200 break-all link max-w-[99%]">
              <span className="mr-1">{platformIcons[social.platform]}</span>{social.url}
            </Link>
          </div>
        ))}
        {address && (
          <div className="flex flex-col">
            <div><MapPin className="inline-block mr-1" size={20} /> {address}</div>
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              className="indent-7 text-primary font-bold text-lg hover:text-primary transition-colors duration-200"
            >
              Route planen
            </Link>
          </div>
        )}
      </section>
    </>
  );
}