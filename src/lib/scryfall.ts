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
	const searchParams = new URLSearchParams({ q: query });
	return fetchScryfall(`/cards/search?${searchParams.toString()}`);
}

export async function getCardById(id: string): Promise<ScryfallCard> {
	return fetchScryfall(`/cards/${id}`);
}

export { ScryfallError };
