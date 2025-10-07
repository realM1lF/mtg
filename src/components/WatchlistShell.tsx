import CardSearch from './CardSearch';
import Watchlist from './Watchlist';
import { useWatchlist } from './WatchlistContext';
import type { ScryfallCard } from '../lib/scryfall';

type WatchlistShellProps = {
	onFindSimilar: (card: ScryfallCard) => void;
};

const WatchlistShell = ({ onFindSimilar }: WatchlistShellProps) => {
	const { entries, addEntry, removeEntry } = useWatchlist();

	return (
		<div className="workspace-grid">
			<CardSearch onSelect={addEntry} />
			<Watchlist
				cards={entries}
				onRemove={removeEntry}
				onPriceAlert={(card) => console.log('Preisalarm für', card.name)}
				onFindSimilar={onFindSimilar}
			/>
		</div>
	);
};

export default WatchlistShell;
