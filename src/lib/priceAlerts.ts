import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';
import type { ScryfallCard } from './scryfall';

const STORAGE_KEY = 'mtg-explorer-price-alerts';

export type PriceAlertComparison = 'at_or_below' | 'drop_below_initial';

export type PriceAlert = {
	card_id: string;
	target_price: number;
	currency: 'eur' | 'usd';
	comparison: PriceAlertComparison;
	initial_price?: number | null;
	last_price?: number | null;
	last_triggered_at?: string | null;
	created_at?: string;
};

function readLocalAlerts(): PriceAlert[] {
	if (typeof window === 'undefined') {
		return [];
	}

	const stored = window.localStorage.getItem(STORAGE_KEY);
	if (!stored) {
		return [];
	}

	try {
		return JSON.parse(stored) as PriceAlert[];
	} catch {
		return [];
	}
}

function writeLocalAlerts(alerts: PriceAlert[]) {
	if (typeof window === 'undefined') {
		return;
	}

	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
}

export async function loadPriceAlerts(): Promise<PriceAlert[]> {
	if (!isSupabaseConfigured()) {
		return readLocalAlerts();
	}

	const supabase = getSupabaseClient();
	if (!supabase) {
		return [];
	}

	const { data, error } = await supabase.from('price_alerts').select('*');
	if (error) {
		console.error('Preisalarme konnten nicht geladen werden:', error);
		return [];
	}

	return data ?? [];
}

export type UpsertPriceAlertInput = {
	card: ScryfallCard;
	target_price: number;
	currency: 'eur' | 'usd';
	comparison: PriceAlertComparison;
};

export async function upsertPriceAlert(input: UpsertPriceAlertInput): Promise<PriceAlert | null> {
	const alert: PriceAlert = {
		card_id: input.card.id,
		target_price: input.target_price,
		currency: input.currency,
		comparison: input.comparison,
		initial_price: parsePrice(input.card.prices?.[input.currency] ?? null),
	};

	if (!isSupabaseConfigured()) {
		const alerts = readLocalAlerts();
		const next = alerts.filter((item) => item.card_id !== alert.card_id);
		next.push(alert);
		writeLocalAlerts(next);
		return alert;
	}

	const supabase = getSupabaseClient();
	if (!supabase) {
		return null;
	}

	const { data, error } = await supabase
		.from('price_alerts')
		.upsert({
			card_id: alert.card_id,
			target_price: alert.target_price,
			currency: alert.currency,
			comparison: alert.comparison,
			initial_price: alert.initial_price,
		})
		.select()
		.single();

	if (error) {
		console.error('Preisalarm konnte nicht gespeichert werden:', error);
		return null;
	}

	return data as PriceAlert;
}

export async function deletePriceAlert(cardId: string): Promise<void> {
	if (!isSupabaseConfigured()) {
		const alerts = readLocalAlerts().filter((item) => item.card_id !== cardId);
		writeLocalAlerts(alerts);
		return;
	}

	const supabase = getSupabaseClient();
	if (!supabase) {
		return;
	}

	const { error } = await supabase.from('price_alerts').delete().eq('card_id', cardId);
	if (error) {
		console.error('Preisalarm konnte nicht gelöscht werden:', error);
	}
}

export function findAlertForCard(alerts: PriceAlert[], cardId: string): PriceAlert | undefined {
	return alerts.find((alert) => alert.card_id === cardId);
}

function parsePrice(value: string | null | undefined): number | null {
	if (!value) {
		return null;
	}
	const parsed = Number.parseFloat(value);
	return Number.isNaN(parsed) ? null : parsed;
}
