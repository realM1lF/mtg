import { type FC, useEffect, useState } from 'react';
import type { ScryfallCard } from '../lib/scryfall';
import { formatPrice } from '../utils/formatPrice';

type WatchlistProps = {
	cards: ScryfallCard[];
	onRemove: (id: string) => void;
	onPriceAlert: (card: ScryfallCard) => void;
	onFindSimilar: (card: ScryfallCard) => void;
};

const Watchlist: FC<WatchlistProps> = ({ cards, onRemove, onPriceAlert, onFindSimilar }) => {
	if (cards.length === 0) {
		return <p className="watchlist-empty">Füge Karten hinzu, um sie zu beobachten.</p>;
	}

	return (
		<section className="watchlist">
			<h2>Watchlist</h2>
			<ul>
				{cards.map((card) => (
					<li key={card.id}>
						<div className="watchlist-card">
							<img src={card.image_uris?.small} alt={card.name} width={120} height={170} loading="lazy" />
							<div>
								<h3>{card.name}</h3>
								<p>{card.type_line}</p>
								<p className="watchlist-price">
									Aktueller Preis: {formatPrice(card.prices?.eur) ?? formatPrice(card.prices?.usd) ?? 'k. A.'}
								</p>
								<div className="watchlist-actions">
									<button type="button" onClick={() => onPriceAlert(card)}>
										Preisalarm setzen
									</button>
									<button type="button" onClick={() => onFindSimilar(card)}>
										Ähnliche Karten
									</button>
									<button type="button" onClick={() => onRemove(card.id)}>
										Entfernen
									</button>
								</div>
							</div>
						</div>
					</li>
					))}
			</ul>
		</section>
	);
};

export default Watchlist;
