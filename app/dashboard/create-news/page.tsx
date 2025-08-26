import CreateNewsForm from "./CreateNewsForm";

export default async function CreateNewsPage() {
  return (
    <main className="flex flex-col gap-4 h-full min-h-[72dvh] max-w-[90%]">
      <h1>Create News</h1>
      <CreateNewsForm />
    </main>
  );
}
