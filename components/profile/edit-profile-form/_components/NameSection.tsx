type NameSectionProps = {
  name: string;
  onChange?: (value: string) => void;
};

export function NameSection({ name, onChange }: NameSectionProps) {
  return (
    <section>
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-gray-700">Name</span>
        <input
          type="text"
          name="name"
          value={name}
          onChange={e => onChange?.(e.target.value)}
          className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full"
        />
      </label>
    </section>
  );
}