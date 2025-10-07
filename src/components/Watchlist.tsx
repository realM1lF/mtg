import { type FC } from 'react';
import type { ScryfallCard } from '../lib/scryfall';
import { formatPrice } from '../utils/formatPrice';
import type { PriceAlert } from '../lib/priceAlerts';

type WatchlistProps = {
	cards: ScryfallCard[];
	alerts: PriceAlert[];
	onRemove: (id: string) => void;
	onPriceAlert: (card: ScryfallCard) => void;
	onFindSimilar: (card: ScryfallCard) => void;
};

const Watchlist: FC<WatchlistProps> = ({ cards, alerts, onRemove, onPriceAlert, onFindSimilar }) => {
	if (cards.length === 0) {
		return <p className="watchlist-empty">Füge Karten hinzu, um sie zu beobachten.</p>;
	}

	return (
		<section className="watchlist">
			<h2>Watchlist</h2>
			<ul>
				{cards.map((card) => {
					const alert = alerts.find((item) => item.card_id === card.id);
					const price = formatPrice(card.prices?.eur) ?? formatPrice(card.prices?.usd) ?? 'k. A.';
					return (
						<li key={card.id}>
							<div className={`watchlist-card${alert ? ' has-alert' : ''}`}>
								<img src={card.image_uris?.small} alt={card.name} width={120} height={170} loading="lazy" />
								<div>
									<h3>{card.name}</h3>
									<p>{card.type_line}</p>
									<p className="watchlist-price">Aktueller Preis: {price}</p>
									{alert && (
										<p className="watchlist-alert">
											Preisalarm {alert.currency.toUpperCase()} {alert.target_price.toFixed(2)}
										</p>
									)}
									<div className="watchlist-actions">
										<button type="button" onClick={() => onPriceAlert(card)}>
											Preisalarm {alert ? 'bearbeiten' : 'setzen'}
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
					);
				})}
			</ul>
		</section>
	);
};

export default Watchlist;
