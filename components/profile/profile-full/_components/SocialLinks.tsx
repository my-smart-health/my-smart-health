import Link from "next/link";

type SocialLinksProps = {
  displayEmail?: string | null;
  website?: string | null;
  parsedSocials: { platform: string; url: string }[];

  platformIcons: Record<string, React.ReactNode>;
}
export default function SocialLinks({ displayEmail, website, parsedSocials, platformIcons }: SocialLinksProps) {

  if (!displayEmail && !website && parsedSocials.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 mx-auto">

        {displayEmail && (
          <Link
            href={`mailto:${displayEmail}`}
            className="badge badge-primary py-5 px-3 text-white hover:bg-primary/75 transition-colors duration-200">
            {platformIcons.Email}
          </Link>
        )}

        {website && (
          <Link
            href={website}
            target="_blank"
            rel="noreferrer noopener"
            className="badge badge-primary py-5 px-3 text-white hover:bg-primary/75 transition-colors duration-200">
            {platformIcons.Website}
          </Link>
        )}

        {parsedSocials.length > 0 && parsedSocials.map((social, idx) => (
          <div key={social.url + idx} className="flex items-center my-auto">
            <Link
              href={social.url}
              target="_blank"
              rel="noreferrer noopener"
              className="badge badge-primary py-5 px-3 text-white hover:bg-primary/75 transition-colors duration-200">
              {platformIcons[social.platform]}
            </Link>
          </div>
        ))}

      </div>
    </>
  );
}