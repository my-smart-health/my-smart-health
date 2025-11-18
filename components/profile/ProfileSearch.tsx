'use client';

import { FormEvent, useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';

import ProfileShort from '@/components/profile/profile-short/ProfileShort';

type SearchResult = {
  id: string;
  name: string;
  bio: string;
  image: string | null;
};

type ProfileSearchProps = {
  className?: string;
  minQueryLength?: number;
};

type SearchMode = 'name' | 'bio' | 'field';

const DEFAULT_MIN_QUERY = 2;
const SEARCH_OPTIONS: { value: SearchMode; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'bio', label: 'Text' },
  { value: 'field', label: 'Fachgebiet' },
];

export default function ProfileSearch({
  className,
  minQueryLength = DEFAULT_MIN_QUERY,
}: ProfileSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [mode, setMode] = useState<SearchMode>('name');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void runSearch(query, mode);
  };

  const runSearch = async (value: string, currentMode: SearchMode) => {
    const trimmed = value.trim();
    if (trimmed.length < minQueryLength) {
      setError(`Bitte mindestens ${minQueryLength} Zeichen eingeben.`);
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(trimmed)}&type=${currentMode}`, {
        method: 'GET',
        cache: 'no-store',
      });
      if (!response.ok) throw new Error('Search request failed');
      const payload = (await response.json()) as { users?: SearchResult[] };
      setResults(Array.isArray(payload.users) ? payload.users : []);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('ProfileSearch fetch error', err);
      }
      setError('Die Suche konnte nicht ausgeführt werden. Bitte erneut versuchen.');
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  return (
    <section className={`w-full ${className ?? ''}`}>
      <div className="w-full rounded-box border-2 border-primary bg-white/90 shadow-sm p-4">
        <h2 className="text-sm font-semibold text-primary">Suche</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <fieldset className="fieldset rounded-box border border-primary/50">
            <div className="flex flex-col sm:flex-row">
              {SEARCH_OPTIONS.map((option, index) => (
                <label
                  key={option.value}
                  className={`flex flex-1 items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-t sm:border-t-0 ${index > 0 ? 'sm:border-l' : ''} ${mode === option.value ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-700'}`}
                >
                  <input
                    type="radio"
                    name="search-mode"
                    value={option.value}
                    checked={mode === option.value}
                    onChange={(event) => setMode(event.target.value as SearchMode)}
                    className="radio radio-primary"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="relative w-full">
            <SearchIcon className="absolute z-10 left-4 top-1/2 -translate-y-1/2" size={20} />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setError(null);
              }}
              placeholder="Name, Bio oder Fachgebiet suchen..."
              className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full pl-12 pr-28"
              aria-label="Profile search"
            />
            <button
              type="submit"
              className="btn btn-primary rounded h-full z-10 absolute top-1/2 right-0 -translate-y-1/2 focus:-translate-y-1/2 active:-translate-y-1/2"
            >
              Suchen
            </button>
          </div>
        </form>
      </div>

      <div className="min-h-[1.5rem] mt-2 text-sm">
        {loading && <p className="text-gray-500">Suche läuft...</p>}
        {!loading && error && <p className="text-error">{error}</p>}
        {!loading && !error && hasSearched && results.length === 0 && (
          <p className="text-gray-500">Keine Profile gefunden.</p>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {results.map((user) => (
          <ProfileShort key={user.id} id={user.id} name={user.name} bio={user.bio} image={user.image} />
        ))}
      </div>
    </section>
  );
}
