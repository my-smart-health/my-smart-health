type EmailSectionProps = {
  email: string;
  setEmail: (val: string) => void;
};

export function EmailSection({ email, setEmail }: EmailSectionProps) {
  return (
    <section>
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-gray-700">Email (Display)</span>
        <input
          type="email"
          name="displayEmail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
        />
      </label>
    </section>
  );
}