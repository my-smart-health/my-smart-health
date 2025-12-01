'use client';

import { FormEvent, useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';

import ProfileShort from '@/components/profile/profile-short/ProfileShort';
import Spinner from '../common/Spinner';
import { Membership } from '@/utils/types';

type SearchResult = {
  id: string;
  name: string;
  bio: string;
  image: string | null;
  membership?: Membership | null;
};

type ProfileSearchProps = {
  className?: string;
  minQueryLength?: number;
};

const DEFAULT_MIN_QUERY = 2;

export default function ProfileSearch({
  className,
  minQueryLength = DEFAULT_MIN_QUERY,
}: ProfileSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void runSearch(query);
  };

  const runSearch = async (value: string) => {
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
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(trimmed)}`, {
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
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex gap-0 w-full shadow-lg rounded-full overflow-hidden border border-gray-300">
          <div className="relative flex-1">
            <SearchIcon className="absolute z-10 left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setError(null);
              }}
              placeholder="Nach Namen, Text..."
              className="py-3 px-4 pl-14 text-base focus:outline-none w-full bg-white border-none"
              aria-label="Profile search"
            />
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 transition-colors duration-200 border-none rounded-none"
          >
            Suchen
          </button>
        </div>
      </form>

      <div className="min-h-[1.5rem] mt-2 text-sm">
        {loading && <p className="text-gray-500"><Spinner label='Suche läuft...' /></p>}
        {!loading && error && <p className="text-error">{error}</p>}
        {!loading && !error && hasSearched && results.length === 0 && (
          <p className="text-gray-500">Keine Profile gefunden.</p>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {results.map((user) => (
          <ProfileShort key={user.id} id={user.id} name={user.name} bio={user.bio} image={user.image} membership={user.membership} />
        ))}
      </div>
    </section>
  );
}
