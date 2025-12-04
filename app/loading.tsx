export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="loading loading-spinner loading-lg text-primary"></div>
      <p className="text-base-content/70">Laden...</p>
    </div>
  );
}
