const SCRYFALL_BASE_URL = 'https://api.scryfall.com';

export type ScryfallList<T> = {
	object: 'list';
	has_more: boolean;
	next_page?: string;
	data: T[];
	warnings?: string[];
};

export type ScryfallCard = {
	id: string;
	name: string;
	lang: string;
	mana_cost?: string;
	type_line: string;
	oracle_text?: string;
	set_name: string;
	image_uris?: {
		normal?: string;
		small?: string;
	};
	related_uris?: Record<string, string>;
	scryfall_uri: string;
	prices?: {
		usd?: string;
		usd_foil?: string;
		eur?: string;
		eur_foil?: string;
		usd_etched?: string;
		tix?: string;
	};
	colors?: string[];
	keywords?: string[];
};

class ScryfallError extends Error {
	constructor(message: string, public readonly status: number) {
		super(message);
		this.name = 'ScryfallError';
	}
}

async function fetchScryfall<T>(endpoint: string): Promise<T> {
	const response = await fetch(`${SCRYFALL_BASE_URL}${endpoint}`);

	if (!response.ok) {
		const errorText = await response.text();
		throw new ScryfallError(`Request failed: ${response.status} ${errorText}`, response.status);
	}

	return response.json() as Promise<T>;
}

export async function searchCards(query: string): Promise<ScryfallList<ScryfallCard>> {
	const searchParams = new URLSearchParams({ q: query, include_multilingual: 'true' });
	return fetchScryfall(`/cards/search?${searchParams.toString()}`);
}

export async function getCardById(id: string): Promise<ScryfallCard> {
	return fetchScryfall(`/cards/${id}`);
}

export async function findSimilarCards(card: ScryfallCard): Promise<ScryfallList<ScryfallCard>> {
	const filters: string[] = [];

	if (card.colors && card.colors.length > 0) {
		filters.push(`color>=${card.colors.join('')}`);
	}

	if (card.type_line) {
		const mainType = card.type_line.split('—')[0]?.trim();
		if (mainType) {
			filters.push(`type:${JSON.stringify(mainType.toLowerCase())}`);
		}
	}

	if (card.keywords && card.keywords.length > 0) {
		for (const keyword of card.keywords.slice(0, 3)) {
			filters.push(`keyword:${JSON.stringify(keyword.toLowerCase())}`);
		}
	}

	filters.push('-is:extra');

	const query = `${filters.join(' ')} -unique:prints`; // Varianten zulassen, Dubletten vermeiden

	return searchCards(query.trim());
}

export { ScryfallError };
