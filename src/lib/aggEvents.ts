// $lib/aggEvents.ts
export type OtherTypeMode = 'exclude' | 'include' | 'only';
// === helpers to read fields regardless of naming ===
function getTitle(r: any): string {
	return (r.eventName ?? r.eventTitle ?? r.title ?? r.name ?? '').toString().trim();
}
function getHall(r: any): string {
	return (r.venueName ?? r.venue ?? r.hall ?? r.venue_space_short_name ?? '').toString().trim();
}
function getSeats(r: any): number | undefined {
	const v = r.venueSpace ?? r.seats ?? r.capacity;
	return typeof v === 'number' && isFinite(v) ? v : undefined;
}
function getDateIso(r: any): string | undefined {
	return r.dateIso ?? r.dateTime ?? r.datetime;
}
function getDateYmd(r: any): string | undefined {
	// dd.mm.yyyy в генераторе уже превращён в ymd (YYYY-MM-DD)
	return r.date ?? r.ymd;
}
function getSeasonRaw(r: any): number | string | undefined {
	return r.season; // может быть числом или строкой
}
function getYearRaw(r: any): number | undefined {
	return typeof r.year === 'number' ? r.year : undefined;
}
function getMonthRaw(r: any): unknown {
	// может быть числом или строкой
	return r.month;
}
function getOtherFlag(r: any): boolean {
	// может быть boolean или текстовая метка («концерт»)
	const val = r.otherEventType;
	if (typeof val === 'boolean') return val;
	return !!(val && String(val).trim()); // строка → считаем «прочее»
}

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
	return rows.filter((r: any) => {
		if (r.theaterId !== opts.theaterId) return false;

		if (opts.year != null) {
			if (Number(getYearRaw(r)) !== Number(opts.year)) return false;
		}
		if (opts.season != null) {
			const s = getSeasonRaw(r);
			if (s == null || Number(s) !== Number(opts.season)) return false;
		}

		if (typeof opts.mainStage === 'boolean') {
			if ((r.mainStage ?? false) !== opts.mainStage) return false;
		}

		const oth = getOtherFlag(r);
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

	for (const r of rows as any[]) {
		const title = getTitle(r) || '—';
		const hall = getHall(r) || '—';
		const key = `${title}__${hall}`;

		const sales = num(r.sales);
		const tickets = num(r.tickets);
		const seats = num(getSeats(r));

		totalSales += sales;

		const cur = map.get(key) ?? { key, title, hall, sales: 0, tickets: 0, seances: 0, seatsSum: 0 };
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

export function aggregateByMonth(rows: RawEventRow[]) {
	type M = { month: string; sales: number; tickets: number; seances: number };
	const map = new Map<string, M>();

	for (const r of rows as any[]) {
		const key = ymKey(r);
		if (!key) continue;

		const cur = map.get(key) ?? { month: key, sales: 0, tickets: 0, seances: 0 };
		cur.sales += num(r.sales);
		cur.tickets += num(r.tickets);
		cur.seances += 1;
		map.set(key, cur);
	}

	return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
}

function ymKey(r: any): string | null {
	// 1) ISO «yyyy-mm-ddThh:mm»
	const iso = getDateIso(r);
	if (iso && typeof iso === 'string') {
		const m = iso.match(/^(\d{4})-(\d{2})/);
		if (m) return `${m[1]}-${m[2]}`;
	}
	// 2) YYYY-MM-DD
	const ymd = getDateYmd(r);
	if (ymd && typeof ymd === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
		return ymd.slice(0, 7);
	}
	// 3) year + month (number|string)
	const year = getYearRaw(r);
	const mm = monthToMM(getMonthRaw(r));
	if (typeof year === 'number' && mm) return `${year}-${mm}`;

	return null;
}

function monthToMM(m: unknown): string | null {
	if (m == null) return null;
	if (typeof m === 'number' && Number.isFinite(m)) {
		const n = Math.trunc(m);
		if (n >= 1 && n <= 12) return String(n).padStart(2, '0');
	}
	if (typeof m !== 'string') return null;
	let s = m.trim().toLowerCase();
	if (!s) return null;
	s = s.replace(/[.\s]/g, '');
	const nMaybe = Number(s);
	if (!Number.isNaN(nMaybe) && nMaybe >= 1 && nMaybe <= 12) return String(nMaybe).padStart(2, '0');
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
	const n = dict[s] ?? dict[s.slice(0, 3)];
	return n ? String(n).padStart(2, '0') : null;
}
