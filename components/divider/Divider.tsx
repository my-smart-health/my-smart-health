export default function Divider({ addClass }: { addClass?: string }) {
  return (
    <div className={`w-full mx-auto border border-primary h-0 max-w-[90%] ${addClass}`}></div>
  );
}