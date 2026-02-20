type BasicInfoSectionProps = {
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  memberId: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  isAdmin?: boolean;
};

export function BasicInfoSection({
  name,
  setName,
  email,
  setEmail,
  memberId,
  role,
  createdAt,
  updatedAt,
  isAdmin = false,
}: BasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      {isAdmin && (
        <>
          <section>
            <label className="flex flex-col gap-2">
              <span className="font-semibold text-gray-700">Member ID</span>
              <input
                type="text"
                value={memberId}
                disabled
                className="p-3 rounded border border-gray-300 bg-gray-100 text-base focus:outline-none w-full cursor-not-allowed"
              />
            </label>
          </section>

          <section>
            <label className="flex flex-col gap-2">
              <span className="font-semibold text-gray-700">Role</span>
              <input
                type="text"
                value={role}
                disabled
                className="p-3 rounded border border-gray-300 bg-gray-100 text-base focus:outline-none w-full cursor-not-allowed"
              />
            </label>
          </section>
        </>
      )}

      <section>
        <label className="flex flex-col gap-2">
          <span className="font-semibold text-gray-700">Email</span>
          <input
            type="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
          />
        </label>
      </section>

      <section>
        <label className="flex flex-col gap-2">
          <span className="font-semibold text-gray-700">Name</span>
          <input
            type="text"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
          />
        </label>
      </section>

      {isAdmin && (
        <>
          <section>
            <label className="flex flex-col gap-2">
              <span className="font-semibold text-gray-700">Created At</span>
              <input
                type="text"
                value={createdAt}
                disabled
                className="p-3 rounded border border-gray-300 bg-gray-100 text-base focus:outline-none w-full cursor-not-allowed"
              />
            </label>
          </section>

          <section>
            <label className="flex flex-col gap-2">
              <span className="font-semibold text-gray-700">Updated At</span>
              <input
                type="text"
                value={updatedAt}
                disabled
                className="p-3 rounded border border-gray-300 bg-gray-100 text-base focus:outline-none w-full cursor-not-allowed"
              />
            </label>
          </section>
        </>
      )}
    </div>
  );
}
