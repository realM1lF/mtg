import { type FC, useEffect, useState } from 'react';
import type { ScryfallCard } from '../lib/scryfall';
import {
	findAlertForCard,
	loadPriceAlerts,
	type PriceAlert,
	upsertPriceAlert,
	deletePriceAlert,
} from '../lib/priceAlerts';
import { formatPrice } from '../utils/formatPrice';

export type PriceAlertModalProps = {
	open: boolean;
	onClose: () => void;
	card: ScryfallCard | null;
	onSaved?: (alert: PriceAlert | null) => void;
};

const PriceAlertModal: FC<PriceAlertModalProps> = ({ open, onClose, card, onSaved }) => {
	const [alerts, setAlerts] = useState<PriceAlert[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [targetPrice, setTargetPrice] = useState('');
	const [currency, setCurrency] = useState<'eur' | 'usd'>('eur');
	const [comparison, setComparison] = useState<'at_or_below' | 'drop_below_initial'>('at_or_below');

	useEffect(() => {
		if (!open) {
			return;
		}

		setLoading(true);
		void loadPriceAlerts()
			.then((data) => {
				setAlerts(data);
			})
			.catch((err) => setError(err instanceof Error ? err.message : 'Fehler beim Laden der Preisalarme'))
			.finally(() => setLoading(false));
	}, [open]);

	useEffect(() => {
		if (!card) {
			return;
		}
		const existing = findAlertForCard(alerts, card.id);
		if (existing) {
			setTargetPrice(existing.target_price.toString());
			setCurrency(existing.currency);
			setComparison(existing.comparison);
		} else {
			setTargetPrice('');
			setCurrency('eur');
			setComparison('at_or_below');
		}
	}, [alerts, card]);

	if (!open || !card) {
		return null;
	}

	const currentPrice = formatPrice(card.prices?.[currency]);

	async function handleSave(event: React.FormEvent) {
		event.preventDefault();
		setError(null);

		const parsed = Number.parseFloat(targetPrice);
		if (Number.isNaN(parsed) || parsed <= 0) {
			setError('Bitte einen gültigen Zielpreis eingeben.');
			return;
		}

		setLoading(true);
		const result = await upsertPriceAlert({
			card,
			target_price: parsed,
			currency,
			comparison,
		});

		setLoading(false);
		if (!result) {
			setError('Preisalarm konnte nicht gespeichert werden.');
			return;
		}

		onSaved?.(result);
		onClose();
	}

	async function handleDelete() {
		if (!card) {
			return;
		}

		await deletePriceAlert(card.id);
		onSaved?.(null);
		onClose();
	}

	return (
		<div className="modal-backdrop" role="dialog" aria-modal="true">
			<div className="modal">
				<header>
					<h2>Preisalarm setzen</h2>
					<button type="button" onClick={onClose} aria-label="Modal schließen">
						×
					</button>
				</header>
				<div className="modal-body">
					<h3>{card.name}</h3>
					<p>
						Aktueller Preis ({currency.toUpperCase()}): {currentPrice ?? 'nicht verfügbar'}
					</p>
					{error && <p role="alert">{error}</p>}
					<form onSubmit={handleSave}>
						<label>
							Zielpreis
							<input
								type="number"
								step="0.01"
								min="0"
								value={targetPrice}
								onChange={(event) => setTargetPrice(event.target.value)}
								required
							/>
						</label>
						<label>
							Währung
							<select value={currency} onChange={(event) => setCurrency(event.target.value as 'eur' | 'usd')}>
								<option value="eur">EUR</option>
								<option value="usd">USD</option>
							</select>
						</label>
						<fieldset>
							<legend>Auslöser</legend>
							<label>
								<input
									type="radio"
									name="comparison"
									value="at_or_below"
									checked={comparison === 'at_or_below'}
									onChange={() => setComparison('at_or_below')}
								/>
								Preis fällt auf Zielpreis oder darunter
							</label>
							<label>
								<input
									type="radio"
									name="comparison"
									value="drop_below_initial"
									checked={comparison === 'drop_below_initial'}
									onChange={() => setComparison('drop_below_initial')}
								/>
								Preis fällt unter den initialen Wert
							</label>
						</fieldset>
						<footer>
							<button type="submit" disabled={loading}>
								Speichern
							</button>
							{findAlertForCard(alerts, card.id) && (
								<button type="button" className="secondary" onClick={handleDelete} disabled={loading}>
									Alarm entfernen
								</button>
							)}
						</footer>
					</form>
				</div>
			</div>
		</div>
	);
};

export default PriceAlertModal;
