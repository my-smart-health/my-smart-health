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
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="w-full sm:w-48">
            <span className="sr-only">Suchfeld wählen</span>
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value as SearchMode)}
              className="select select-bordered w-full sm:h-full border-primary font-semibold"
            >
              {SEARCH_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="relative flex-1">
            <SearchIcon className="absolute z-10 left-4 top-1/2 -translate-y-1/2" size={20} />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setError(null);
              }}
              placeholder="Suche..."
              className="p-3 rounded border border-primary text-base focus:outline-none focus:ring-2 focus:ring-primary w-full pl-12 pr-28"
              aria-label="Profile search"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary rounded my-auto "
          >
            Suchen
          </button>
        </div>
      </form>

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
