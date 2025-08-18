// $lib/aggEvents.ts
export type OtherTypeMode = 'exclude' | 'include' | 'only';

export interface RawEventRow {
	theaterId: number;
	theaterName?: string;
	year?: number;
	season?: number | null;
	month?: string | number | null; // "Jan" | "Фев" | "02" — что угодно из CSV
	date?: string; // "dd.mm.yyyy"
	dateIso?: string; // "yyyy-mm-ddThh:mm+03:00[...]"
	eventName: string; // название спектакля
	venueName: string; // сцена/зал
	mainStage?: boolean | null;
	sales?: number | null;
	tickets?: number | null;
	venueSpace?: number | null; // вместимость зала на показ
	eventCount?: number | null; // обычно 1
	seasonEnded?: boolean | null;
	averagePrice?: number | null;
	otherEventType?: boolean | null;
}

export interface FilterOpts {
	theaterId: number;
	year?: number;
	season?: number;
	mainStage?: boolean;
	otherTypeMode?: OtherTypeMode;
}

/** ——— ФИЛЬТР ——————————————————————————————————————————— */
export function filterRows(rows: RawEventRow[], opts: FilterOpts): RawEventRow[] {
	const mode: OtherTypeMode = opts.otherTypeMode ?? 'exclude';
	return rows.filter((r) => {
		if (r.theaterId !== opts.theaterId) return false;

		if (opts.year != null && Number(r.year) !== Number(opts.year)) return false;
		if (opts.season != null && Number(r.season) !== Number(opts.season)) return false;

		if (typeof opts.mainStage === 'boolean') {
			if ((r.mainStage ?? false) !== opts.mainStage) return false;
		}

		const oth = !!r.otherEventType;
		if (mode === 'exclude' && oth) return false;
		if (mode === 'only' && !oth) return false;

		return true;
	});
}

/** ——— АГРЕГАТ ПО (НАЗВАНИЕ + СЦЕНА) — для таблицы ————————————— */
export function aggregateByTitleHall(rows: RawEventRow[]) {
	type Acc = {
		key: string;
		title: string;
		hall: string;
		sales: number;
		tickets: number;
		seances: number;
		seatsSum: number;
	};

	const map = new Map<string, Acc>();
	let totalSales = 0;

	for (const r of rows) {
		// ←↓↓ КЛЮЧЕВАЯ ПРАВКА: берём title/hall из разных возможных полей
		const titleRaw =
			(r as any).eventName ?? (r as any).eventTitle ?? (r as any).title ?? (r as any).name;

		const hallRaw =
			(r as any).venueName ??
			(r as any).venue ??
			(r as any).hall ??
			(r as any).venue_space_short_name;

		const title = safeTitle(titleRaw);
		const hall = (hallRaw ?? '').toString().trim() || '—';

		const key = `${title}__${hall}`;

		const sales = num(r.sales);
		const tickets = num(r.tickets);
		const seats = num(r.venueSpace);

		totalSales += sales;

		const cur = map.get(key) ?? {
			key,
			title,
			hall,
			sales: 0,
			tickets: 0,
			seances: 0,
			seatsSum: 0
		};
		cur.sales += sales;
		cur.tickets += tickets;
		cur.seances += 1;
		cur.seatsSum += seats;
		map.set(key, cur);
	}

	const arr = Array.from(map.values()).map((x) => {
		const occupancy = x.seances && x.seatsSum ? clamp0to1(x.tickets / x.seatsSum) : undefined;
		return {
			title: x.title,
			hall: x.hall,
			sales: x.sales,
			salesPerShow: x.seances ? x.sales / x.seances : 0,
			tickets: x.tickets,
			seances: x.seances,
			occupancy,
			share: totalSales ? x.sales / totalSales : 0
		};
	});

	arr.sort((a, b) => b.sales - a.sales);
	return arr;
}

/** ——— АГРЕГАТ ПО МЕСЯЦАМ (YYYY-MM) — для графиков ——————————— */
export function aggregateByMonth(rows: RawEventRow[]) {
	type M = { month: string; sales: number; tickets: number; seances: number };

	const map = new Map<string, M>();

	for (const r of rows) {
		const key = ymKey(r);
		if (!key) continue; // пропускаем записи без даты

		const cur = map.get(key) ?? { month: key, sales: 0, tickets: 0, seances: 0 };
		cur.sales += num(r.sales);
		cur.tickets += num(r.tickets);
		cur.seances += 1;
		map.set(key, cur);
	}

	// Ключ в формате YYYY-MM → можно лексикографически
	return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
}

/* ===================== helpers ===================== */

function num(x: number | null | undefined): number {
	return typeof x === 'number' && isFinite(x) ? x : 0;
}
function clamp0to1(v: number) {
	return Math.max(0, Math.min(1, v));
}
function safeTitle(t: string | undefined) {
	const s = (t ?? '').trim();
	// Оставим как есть (без принудительного lower/Title Case),
	// чтобы не ломать оригинальную раскладку названий.
	return s || '—';
}

function ymKey(r: RawEventRow): string | null {
	// 1) ISO: "2024-01-02T19:00..."
	if (r.dateIso && typeof r.dateIso === 'string') {
		const m = r.dateIso.match(/^(\d{4})-(\d{2})/);
		if (m) return `${m[1]}-${m[2]}`;
	}
	// 2) "dd.mm.yyyy"
	if (r.date && typeof r.date === 'string') {
		const m = r.date.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
		if (m) return `${m[3]}-${m[2]}`;
	}
	// 3) (year, month) — month может быть числом/строкой
	if (typeof r.year === 'number' && r.month != null) {
		const mm = monthToMM(r.month);
		if (mm) return `${r.year}-${mm}`;
	}
	return null;
}

function monthToMM(m: unknown): string | null {
	if (m == null) return null;

	// Число 1..12
	if (typeof m === 'number' && Number.isFinite(m)) {
		const n = Math.trunc(m);
		if (n >= 1 && n <= 12) return String(n).padStart(2, '0');
	}

	// Строка любой формы
	if (typeof m !== 'string') return null;
	let s = m.trim().toLowerCase();
	if (!s) return null;

	// Уберём точки/пробелы: "Sept.", "сен." → "sept", "сен"
	s = s.replace(/[.\s]/g, '');

	// Если цифрами
	const nMaybe = Number(s);
	if (!Number.isNaN(nMaybe) && nMaybe >= 1 && nMaybe <= 12) {
		return String(nMaybe).padStart(2, '0');
	}

	// Словарь ENG/RU (и падежи)
	const dict: Record<string, number> = {
		jan: 1,
		january: 1,
		feb: 2,
		february: 2,
		mar: 3,
		march: 3,
		apr: 4,
		april: 4,
		may: 5,
		jun: 6,
		june: 6,
		jul: 7,
		july: 7,
		aug: 8,
		august: 8,
		sep: 9,
		sept: 9,
		september: 9,
		oct: 10,
		october: 10,
		nov: 11,
		november: 11,
		dec: 12,
		december: 12,

		янв: 1,
		январь: 1,
		января: 1,
		фев: 2,
		февраль: 2,
		февраля: 2,
		мар: 3,
		март: 3,
		марта: 3,
		апр: 4,
		апрель: 4,
		апреля: 4,
		май: 5,
		мая: 5,
		июн: 6,
		июнь: 6,
		июня: 6,
		июл: 7,
		июль: 7,
		июля: 7,
		авг: 8,
		август: 8,
		августа: 8,
		сен: 9,
		сент: 9,
		сентябрь: 9,
		сентября: 9,
		окт: 10,
		октябрь: 10,
		октября: 10,
		ноя: 11,
		ноябрь: 11,
		ноября: 11,
		дек: 12,
		декабрь: 12,
		декабря: 12
	};

	// Пытаемся полным ключом, затем по трёхбукв. префиксу
	const n = dict[s] ?? dict[s.slice(0, 3)];
	if (n) return String(n).padStart(2, '0');

	return null;
}
