import { type FC, useEffect, useState } from 'react';
import type { ScryfallCard } from '../lib/scryfall';
import { searchCards, ScryfallError } from '../lib/scryfall';

type CardListProps = {
	query: string;
};

type CardListState =
	| { status: 'idle' }
	| { status: 'loading' }
	| { status: 'error'; message: string }
	| { status: 'success'; cards: ScryfallCard[] };

const CardList: FC<CardListProps> = ({ query }) => {
	const [state, setState] = useState<CardListState>({ status: 'idle' });

	useEffect(() => {
		let cancelled = false;

		async function loadCards() {
			setState({ status: 'loading' });

			try {
				const result = await searchCards(query);

				if (cancelled) {
					return;
				}

				setState({ status: 'success', cards: result.data });
			} catch (error) {
				if (cancelled) {
					return;
				}

				const message =
					error instanceof ScryfallError
						? `Scryfall-Fehler (${error.status}): ${error.message}`
						: 'Unerwarteter Fehler beim Laden der Karten';
				setState({ status: 'error', message });
			}
		}

		void loadCards();

		return () => {
			cancelled = true;
		};
	}, [query]);

	if (state.status === 'idle' || state.status === 'loading') {
		return <p>Karten werden geladen …</p>;
	}

	if (state.status === 'error') {
		return <p>{state.message}</p>;
	}

	if (state.cards.length === 0) {
		return <p>Keine Karten gefunden.</p>;
	}

	return (
		<ul>
			{state.cards.map((card) => (
				<li key={card.id}>
					<strong>{card.name}</strong> — {card.type_line}
				</li>
			))}
		</ul>
	);
};

export default CardList;
