import Divider from "@/components/divider/Divider";

type Social = {
  platform: string;
  url: string;
};

type SocialsSectionProps = {
  socials: Social[];
  setSocials: (socials: Social[]) => void;
  platformIcons: Record<string, React.ReactNode>;
};

export function SocialsSection({ socials, setSocials, platformIcons }: SocialsSectionProps) {
  return (
    <section className="flex flex-col gap-2 mt-1">
      <span className="font-semibold text-gray-700">Socials</span>
      {socials.map((social, idx) => (
        <div key={idx} className="flex flex-row flex-wrap gap-4 items-center mb-4">
          <input
            type="text"
            placeholder="URL"
            value={social.url}
            onChange={e => {
              const updated = [...socials];
              updated[idx].url = e.target.value;
              setSocials(updated);
            }}
            className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary flex-1 min-w-[200px]"
          />
          <div className="flex flex-col w-full gap-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center max-w-[40px]">
                {platformIcons[social.platform] || null}
              </span>
              <select
                className="select select-bordered select-primary w-full max-w-xs border-primary"
                name={`socials[${idx}].platform`}
                value={social.platform}
                onChange={e => {
                  const updated = [...socials];
                  updated[idx].platform = e.target.value;
                  setSocials(updated);
                }}
              >
                <option disabled value="">Pick a platform</option>
                <option value="Email">Email</option>
                <option value="Website">Website</option>
                <option value="Facebook">Facebook</option>
                <option value="Linkedin">Linkedin</option>
                <option value="X">X.com</option>
                <option value="Youtube">Youtube</option>
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!confirm("Are you sure you want to remove this social link?")) return;
                setSocials(socials.filter((_, i) => i !== idx));
              }}
              className="btn btn-outline text-red-500 self-end"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <Divider addClass="my-4" />

      <button
        type="button"
        onClick={() => setSocials([...socials, { platform: '', url: '' }])}
        className="btn btn-outline btn-primary px-3 py-1 w-full rounded"
      >
        Add Social Link
      </button>
    </section>
  );
}