import { type FC, useEffect, useMemo, useState } from 'react';
import type { ScryfallCard } from '../lib/scryfall';
import { searchCards } from '../lib/scryfall';
import { formatPrice } from '../utils/formatPrice';

const DEBOUNCE_MS = 300;

export type CardSearchProps = {
	onSelect: (card: ScryfallCard) => void;
};

const CardSearch: FC<CardSearchProps> = ({ onSelect }) => {
	const [term, setTerm] = useState('');
	const [results, setResults] = useState<ScryfallCard[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const debouncedTerm = useDebouncedValue(term, DEBOUNCE_MS);

	useEffect(() => {
		async function runSearch() {
			if (!debouncedTerm.trim()) {
				setResults([]);
				return;
			}

			setLoading(true);
			setError(null);
			try {
				const response = await searchCards(debouncedTerm.trim());
				setResults(response.data.slice(0, 10));
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
			} finally {
				setLoading(false);
			}
		}

		void runSearch();
	}, [debouncedTerm]);

	return (
		<section className="card-search">
			<label htmlFor="card-search-input">Karte suchen</label>
			<input
				type="search"
				id="card-search-input"
				placeholder="z. B. Lightning Bolt"
				value={term}
				onChange={(event) => setTerm(event.target.value)}
			/>
			{loading && <p>Suche läuft …</p>}
			{error && <p role="alert">{error}</p>}
			{!loading && results.length > 0 && (
				<ul className="search-results">
					{results.map((card) => (
						<li key={card.id}>
							<button type="button" onClick={() => onSelect(card)}>
								<div>
									<span>{card.name}</span>
									<small>{card.set_name}</small>
								</div>
								<div className="search-price">
									{formatPrice(card.prices?.eur) ?? formatPrice(card.prices?.usd) ?? 'Preis n/a'}
								</div>
							</button>
						</li>
					))}
				</ul>
			)}
			{!loading && !error && debouncedTerm && results.length === 0 && <p>Keine Treffer.</p>}
		</section>
	);
};

function useDebouncedValue<T>(value: T, delay: number): T {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const handle = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(handle);
	}, [value, delay]);

	return debounced;
}

export default CardSearch;
