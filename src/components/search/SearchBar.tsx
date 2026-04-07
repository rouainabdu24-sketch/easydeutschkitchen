import { useState, useEffect, useRef } from 'react';

interface RecipeEntry {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  heroImage: string;
  heroImageAlt: string;
  prepTime: number;
  cookTime: number;
  difficulty: string;
}

const difficultyLabel: Record<string, string> = {
  einfach: 'Einfach',
  mittel: 'Mittel',
  schwer: 'Schwer',
};

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<RecipeEntry[]>([]);
  const [results, setResults] = useState<RecipeEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadIndex = async () => {
    if (fetched) return;
    setLoading(true);
    try {
      const res = await fetch('/search-index.json');
      const data: RecipeEntry[] = await res.json();
      setIndex(data);
      setFetched(true);
    } catch {
      // silently fail — search just won't work
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    setResults(
      index.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q))
      )
    );
  }, [query, index]);

  return (
    <div className="relative w-full">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          placeholder="Rezept, Zutat oder Kategorie suchen..."
          value={query}
          onFocus={loadIndex}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          aria-label="Rezepte suchen"
          autoFocus
        />
      </div>

      {loading && (
        <p className="mt-4 text-gray-400 text-sm text-center">Rezepte laden...</p>
      )}

      {results.length > 0 && (
        <ul className="mt-6 space-y-3" role="list" aria-label="Suchergebnisse">
          {results.map(r => (
            <li key={r.slug}>
              <a
                href={`/rezepte/${r.slug}/`}
                className="flex gap-4 p-4 rounded-xl hover:bg-amber-50 border border-gray-100 hover:border-amber-200 transition-colors group"
              >
                <img
                  src={r.heroImage}
                  alt={r.heroImageAlt}
                  width={80}
                  height={120}
                  className="rounded-lg object-cover w-16 h-24 bg-gray-100 shrink-0"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                    {r.title}
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5 capitalize">{r.category}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{r.description}</p>
                  <div className="flex gap-3 mt-2 text-xs text-gray-400">
                    <span>⏱ {r.prepTime + r.cookTime} Min.</span>
                    <span>{difficultyLabel[r.difficulty] ?? r.difficulty}</span>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}

      {query.trim() && results.length === 0 && !loading && fetched && (
        <div className="mt-8 text-center">
          <p className="text-gray-500">Keine Rezepte gefunden für „{query}"</p>
          <a href="/rezepte/" className="mt-3 inline-block text-amber-700 text-sm hover:underline">
            Alle Rezepte ansehen →
          </a>
        </div>
      )}
    </div>
  );
}
