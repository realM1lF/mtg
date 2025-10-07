import {
	createContext,
	useCallback,
	useContext,
	type FC,
	type PropsWithChildren,
	useEffect,
	useMemo,
	useState,
} from 'react';
import type { ScryfallCard } from '../lib/scryfall';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabaseClient';

const STORAGE_KEY = 'mtg-explorer-watchlist';

export type WatchlistEntry = ScryfallCard;

export type WatchlistContextValue = {
	entries: WatchlistEntry[];
	addEntry: (entry: WatchlistEntry) => void;
	removeEntry: (id: string) => void;
};

const WatchlistContext = createContext<WatchlistContextValue | undefined>(undefined);

function readInitialEntries(): WatchlistEntry[] {
	if (typeof window === 'undefined') {
		return [];
	}

	const stored = window.localStorage.getItem(STORAGE_KEY);
	if (!stored) {
		return [];
	}

	try {
		return JSON.parse(stored) as WatchlistEntry[];
	} catch {
		return [];
	}
}

export const WatchlistProvider: FC<PropsWithChildren> = ({ children }) => {
	const [entries, setEntries] = useState<WatchlistEntry[]>(readInitialEntries);

	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

		if (!isSupabaseConfigured()) {
			return;
		}

		const supabase = getSupabaseClient();
		if (!supabase) {
			return;
		}

		void supabase
			.from('watchlist')
			.upsert(
				entries.map((entry) => ({
					card_id: entry.id,
					payload: entry,
				})),
				{ onConflict: 'card_id' },
			)
			.then((response) => {
				if (response.error) {
					console.error('Supabase-Sync fehlgeschlagen', response.error);
				}
			});
	}, [entries]);

	const addEntry = useCallback((entry: WatchlistEntry) => {
		setEntries((prev) => {
			const exists = prev.some((item) => item.id === entry.id);
			if (exists) {
				return prev;
			}
			return [...prev, entry];
		});
	}, []);

	const removeEntry = useCallback((id: string) => {
		setEntries((prev) => prev.filter((item) => item.id !== id));
	}, []);

	const value = useMemo(() => ({ entries, addEntry, removeEntry }), [entries, addEntry, removeEntry]);

	return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
};

export function useWatchlist(): WatchlistContextValue {
	const context = useContext(WatchlistContext);
	if (!context) {
		throw new Error('useWatchlist must be used inside WatchlistProvider');
	}
	return context;
}
