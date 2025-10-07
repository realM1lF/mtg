export function formatPrice(value?: string | null): string | null {
	if (!value) {
		return null;
	}

	const numeric = Number.parseFloat(value);
	if (Number.isNaN(numeric)) {
		return null;
	}

	return `${numeric.toFixed(2)} €`;
}
