import { useEffect, useState } from 'react';
import { WatchlistProvider } from './WatchlistContext';
import WatchlistShell from './WatchlistShell';
import SimilarCardsDrawer from './SimilarCardsDrawer';
import PriceAlertModal from './PriceAlertModal';
import type { ScryfallCard } from '../lib/scryfall';
import { loadPriceAlerts, type PriceAlert } from '../lib/priceAlerts';

const WatchlistApp = () => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [drawerCard, setDrawerCard] = useState<ScryfallCard | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [modalCard, setModalCard] = useState<ScryfallCard | null>(null);
	const [alerts, setAlerts] = useState<PriceAlert[]>([]);

	useEffect(() => {
		void loadPriceAlerts().then((data) => setAlerts(data));
	}, []);

	return (
		<WatchlistProvider>
			<WatchlistShell
				alerts={alerts}
				onFindSimilar={(card) => {
					setDrawerCard(card);
					setDrawerOpen(true);
				}}
				onPriceAlert={(card) => {
					setModalCard(card);
					setModalOpen(true);
				}}
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
			<PriceAlertModal
				open={modalOpen}
				card={modalCard}
				onClose={() => setModalOpen(false)}
				onSaved={(alert) => {
					if (!alert) {
						setAlerts((prev) => prev.filter((item) => item.card_id !== modalCard?.id));
						return;
					}
					setAlerts((prev) => {
						const next = prev.filter((item) => item.card_id !== alert.card_id);
						next.push(alert);
						return next;
					});
				}}
			/>
		</WatchlistProvider>
	);
};

export default WatchlistApp;
