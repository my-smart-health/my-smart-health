
import { Membership } from "@/utils/types";

type MembershipSectionProps = {
  membership: Membership;
  setMembership: (membership: Membership) => void;
};

export function MembershipSection({ membership, setMembership }: MembershipSectionProps) {

  return (
    <>
      <h2 className="text-primary font-bold">Membership Status</h2>

      <div className="form-control mb-4">
        <label className="label cursor-pointer justify-start gap-3">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={membership.status}
            onChange={(e) => setMembership({ ...membership, status: e.target.checked })}
          />
          <span className="label-text font-semibold">Display Membership Badge</span>
        </label>
      </div>

      <div className="form-control mb-4 space-y-2 border border-primary p-4 rounded-lg">

        <div className="flex flex-col space-y-1">
          Below are examples of valid URLs for the Membership Link:
          <br />
          <br />
          URL:<span className="label text-primary font-semibold"> https://example.com</span><br />
          Phone:<span className="label text-primary font-semibold"> tel:+1234567</span><br />
          Email:<span className="label text-primary font-semibold"> mailto:example@example.com</span>
        </div>

        <label className="label">
          <span className="font-semibold">Membership Link</span>
        </label>
        <input
          type="text"
          placeholder="schnelle Termine - mysmart.health"
          className="input input-bordered w-full"
          value={membership.link}
          onChange={(e) => setMembership({ ...membership, link: e.target.value })}
        />

        <label className="label">
          <span className="label-text-alt">Default: Internal profile link | Custom: Any valid URL</span>
        </label>
      </div>

      <div className={`p-4 border rounded-lg w-full text-center ${membership.status ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
        {membership.status ? (
          <p className="text-green-700 font-semibold">✓ Membership Badge Active</p>
        ) : (
          <p className="text-gray-700 font-semibold">Membership Badge Disabled</p>
        )}
      </div>
    </>
  );
}