import { type FC, useEffect, useState } from 'react';
import type { ScryfallCard } from '../lib/scryfall';
import { findSimilarCards } from '../lib/scryfall';

export type SimilarCardsDrawerProps = {
	open: boolean;
	onClose: () => void;
	referenceCard: ScryfallCard | null;
	onAddToWatchlist: (card: ScryfallCard) => void;
};

const SimilarCardsDrawer: FC<SimilarCardsDrawerProps> = ({ open, onClose, referenceCard, onAddToWatchlist }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [results, setResults] = useState<ScryfallCard[]>([]);

	useEffect(() => {
		if (!referenceCard || !open) {
			setResults([]);
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);

		void findSimilarCards(referenceCard)
			.then((response) => {
				setResults(response.data.filter((card) => card.id !== referenceCard.id).slice(0, 8));
			})
			.catch((err) => {
				setError(err instanceof Error ? err.message : 'Fehler beim Laden ähnlicher Karten');
			})
			.finally(() => setLoading(false));
	}, [referenceCard, open]);

	if (!open) {
		return null;
	}

	return (
		<div className="drawer-backdrop" role="dialog" aria-modal="true">
			<div className="drawer">
				<header>
					<h2>Ähnliche Karten</h2>
					<button type="button" onClick={onClose} aria-label="Drawer schließen">
						×
					</button>
				</header>
				<div className="drawer-content">
					{loading && <p>Lade ähnliche Karten …</p>}
					{error && <p role="alert">{error}</p>}
					{!loading && !error && results.length === 0 && <p>Keine Vorschläge gefunden.</p>}
					{!loading && results.length > 0 && (
						<ul className="similar-cards-grid">
							{results.map((card) => (
								<li key={card.id}>
									<button type="button" onClick={() => onAddToWatchlist(card)}>
										<img src={card.image_uris?.small} alt={card.name} width={110} height={155} loading="lazy" />
										<span>{card.name}</span>
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
};

export default SimilarCardsDrawer;
