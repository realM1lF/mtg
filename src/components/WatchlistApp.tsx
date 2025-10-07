import { useState } from 'react';
import { WatchlistProvider } from './WatchlistContext';
import WatchlistShell from './WatchlistShell';
import SimilarCardsDrawer from './SimilarCardsDrawer';
import type { ScryfallCard } from '../lib/scryfall';

const WatchlistApp = () => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [drawerCard, setDrawerCard] = useState<ScryfallCard | null>(null);

	return (
		<WatchlistProvider>
			<WatchlistShell
				onFindSimilar={(card) => {
					setDrawerCard(card);
					setDrawerOpen(true);
				}}
				onDrawerClose={() => setDrawerOpen(false)}
			/>
			<SimilarCardsDrawer
				open={drawerOpen}
				referenceCard={drawerCard}
				onClose={() => setDrawerOpen(false)}
				onAddToWatchlist={(card) => {
					const event = new CustomEvent<ScryfallCard>('watchlist:add', { detail: card });
					window.dispatchEvent(event);
					setDrawerOpen(false);
				}}
			/>
		</WatchlistProvider>
	);
};

export default WatchlistApp;
