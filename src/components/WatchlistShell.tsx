import { useEffect, useState } from 'react';
import CardSearch from './CardSearch';
import Watchlist from './Watchlist';
import { useWatchlist } from './WatchlistContext';
import type { ScryfallCard } from '../lib/scryfall';
import type { PriceAlert } from '../lib/priceAlerts';
import { loadPriceAlerts } from '../lib/priceAlerts';

type WatchlistShellProps = {
	onFindSimilar: (card: ScryfallCard) => void;
	onPriceAlert: (card: ScryfallCard) => void;
	alerts: PriceAlert[];
};

const WatchlistShell = ({ onFindSimilar, onPriceAlert, alerts }: WatchlistShellProps) => {
	const { entries, addEntry, removeEntry } = useWatchlist();

	return (
		<div className="workspace-grid">
			<CardSearch onSelect={addEntry} />
			<Watchlist
				cards={entries}
				alerts={alerts}
				onRemove={removeEntry}
				onPriceAlert={onPriceAlert}
				onFindSimilar={onFindSimilar}
			/>
		</div>
	);
};

export default WatchlistShell;
