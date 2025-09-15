export const titleCase = (str: unknown, fallback = '—') => {
	const s = (str ?? '').toString().trim();
	if (!s) return fallback;
	return s.replace(/\p{L}+/gu, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
};

export const joinTitleCase = (parts: unknown[], sep = ' / ', fallback = '—') => {
	const items = parts.map((v) => titleCase(v, '')).filter(Boolean);
	return items.length ? items.join(sep) : fallback;
};

export const trimTitles = (titles?: unknown, max = 60) => {
	const s = (titles ?? '').toString();
	return s.length > max ? s.slice(0, max - 3) + '…' : s;
};

export function formatPhone(raw?: string | null) {
	if (!raw) return '';
	let d = raw.replace(/\D+/g, '');
	if (d.length === 11) {
		if (d[0] === '8') d = '7' + d.slice(1);
		const m = d.match(/^(\d)(\d{3})(\d{3})(\d{2})(\d{2})$/);
		if (m) {
			const [, c, a, b, c2, d2] = m;
			return `+${c}-${a}-${b}-${c2}-${d2}`;
		}
	}
	return raw.trim();
}

export const hasStat = (n?: number | null) => typeof n === 'number' && Number.isFinite(n) && n > 0;
export const safeHref = (url?: string | null) => (url && url.trim() ? url : null);

export function formatRubAbbreviated(number: number) {
	const abs = Math.abs(number);
	let suffix = '',
		divisor = 1;
	if (abs >= 1e9) {
		suffix = ' млрд';
		divisor = 1e9;
	} else if (abs >= 1e6) {
		suffix = ' млн';
		divisor = 1e6;
	} else if (abs >= 1e3) {
		suffix = ' тыс';
		divisor = 1e3;
	}
	const short = number / divisor;
	const formatted = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }).format(short);
	return `${formatted}${suffix}`;
}

export const fmtRub = (n: number) => new Intl.NumberFormat('ru-RU').format(n);
export const fmtInt = (n?: number | null) =>
	n == null ? '—' : new Intl.NumberFormat('ru-RU').format(Math.round(n));
export const fmtPercent01 = (x?: number | null, digits = 0) =>
	x == null ? '—' : `${(x * 100).toFixed(digits)}%`;

export const fmtDeltaPct = (x: number | null, digits = 0) => {
	if (x === null) return '';
	const v = x * 100;
	const s = v > 0 ? '+' : '';
	return `${s}${v.toFixed(digits)}%`;
};
export const fmtDeltaPP = (x: number | null, digits = 1) => {
	if (x === null) return '';
	const s = x > 0 ? '+' : '';
	return `${s}${x.toFixed(digits)} п.п.`;
};
export const deltaClass = (x: number | null) =>
	x === null
		? 'text-slate-400/60'
		: x > 0
			? 'text-emerald-400'
			: x < 0
				? 'text-rose-400'
				: 'text-slate-400';
