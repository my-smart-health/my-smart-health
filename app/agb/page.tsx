import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AGB - Allgemeine Geschäftsbedingungen | My Smart Health",
  description: "Allgemeine Geschäftsbedingungen von My Smart Health - Wir machen Düsseldorf gesünder.",
  openGraph: {
    title: "AGB - Allgemeine Geschäftsbedingungen | My Smart Health",
    description: "Allgemeine Geschäftsbedingungen von My Smart Health - Wir machen Düsseldorf gesünder.",
  },
};

export default function AGBPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">
        Allgemeine Geschäftsbedingungen (AGB)
      </h1>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>

        </section>

        <section>

        </section>

        <section className="mt-8 pt-6 border-t border-gray-200">

        </section>

        <section className="mt-6 text-xs text-gray-600">
          <p>Stand: {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </section>
      </div>
    </div>
  );
}
