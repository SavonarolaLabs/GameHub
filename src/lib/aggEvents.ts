export type OtherTypeMode = 'exclude' | 'include' | 'only';
export type EndedMode = 'all' | 'active' | 'ended';

// ——— входные строки могут иметь разные имена полей, поэтому все читаем через геттеры
type AnyRow = Record<string, unknown>;

/* ================= helpers to read fields regardless of naming ================= */

function getTitle(r: AnyRow): string {
	return (r.eventName ?? r.eventTitle ?? r.title ?? r.name ?? '').toString().trim();
}
function getHall(r: AnyRow): string {
	return (r.venueName ?? r.venue ?? r.hall ?? '').toString().trim();
}
function getSeats(r: AnyRow): number | undefined {
	const v = r.venueSpace ?? r.seats ?? r.capacity;
	return typeof v === 'number' && isFinite(v) ? v : undefined;
}
function getYear(r: AnyRow): number | undefined {
	return typeof r.year === 'number' ? r.year : undefined;
}
function getMonth(r: AnyRow): unknown {
	return r.month;
}
function getDateIso(r: AnyRow): string | undefined {
	return (r.dateIso ?? r.dateTime ?? r.datetime) as string | undefined;
}
function getDateYmd(r: AnyRow): string | undefined {
	// генератор пишет ymd = 'YYYY-MM-DD'
	return (r.date ?? r.ymd) as string | undefined;
}
function getSeason(r: AnyRow): number | undefined {
	const s = r.season;
	if (s == null) return undefined;
	const n = Number(s);
	return Number.isFinite(n) ? n : undefined;
}
function getMainStage(r: AnyRow): boolean {
	return !!r.mainStage;
}
function getOtherFlag(r: AnyRow): boolean {
	// generator: boolean | string; string («концерт», «встреча») считаем «прочим»
	const v = r.otherEventType;
	if (typeof v === 'boolean') return v;
	return !!(v && String(v).trim());
}
function getEnded(r: AnyRow): boolean | undefined {
	// generator: ended; на всякий случай поддержим seasonEnded
	const v = r.ended ?? r.seasonEnded;
	return typeof v === 'boolean' ? v : undefined;
}

/* ================= small utils ================= */

function num(x: unknown): number {
	return typeof x === 'number' && isFinite(x) ? x : 0;
}
function clamp0to1(v: number) {
	return Math.max(0, Math.min(1, v));
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
	if (!Number.isNaN(nMaybe) && nMaybe >= 1 && nMaybe <= 12) {
		return String(nMaybe).padStart(2, '0');
	}

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

function ymKey(r: AnyRow): string | null {
	// 1) ISO
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
	// 3) (year, month)
	const y = getYear(r);
	const mm = monthToMM(getMonth(r));
	if (typeof y === 'number' && mm) return `${y}-${mm}`;
	return null;
}

/* ================= public API ================= */

export interface FilterOpts {
	theaterId: number;
	year?: number;
	season?: number;
	mainStage?: boolean;
	otherTypeMode?: OtherTypeMode;
	endedMode?: EndedMode; // NEW
}

/** ——— ФИЛЬТР ——————————————————————————————————————————— */
export function filterRows(rows: AnyRow[], opts: FilterOpts): AnyRow[] {
	const mode: OtherTypeMode = opts.otherTypeMode ?? 'exclude';
	const endedMode: EndedMode = opts.endedMode ?? 'all';

	return rows.filter((r) => {
		if (r.theaterId !== opts.theaterId) return false;

		if (opts.year != null) {
			if (getYear(r) !== Number(opts.year)) return false;
		}
		if (opts.season != null) {
			if (getSeason(r) !== Number(opts.season)) return false;
		}

		if (typeof opts.mainStage === 'boolean') {
			if (getMainStage(r) !== opts.mainStage) return false;
		}

		const oth = getOtherFlag(r);
		if (mode === 'exclude' && oth) return false;
		if (mode === 'only' && !oth) return false;

		if (endedMode !== 'all') {
			const ended = getEnded(r);
			if (endedMode === 'ended' && ended !== true) return false;
			if (endedMode === 'active' && ended !== false) return false;
		}

		return true;
	});
}

export function aggregateByTitleHall(rows: AnyRow[]) {
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
			occupancy, // 0…1
			share: totalSales ? x.sales / totalSales : 0
		};
	});

	arr.sort((a, b) => b.sales - a.sales);
	return arr;
}

/** ——— АГРЕГАТ ПО МЕСЯЦАМ (YYYY-MM) — для графиков ——————————— */
export function aggregateByMonth(rows: AnyRow[]) {
	type M = { month: string; sales: number; tickets: number; seances: number };
	const map = new Map<string, M>();

	for (const r of rows) {
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
