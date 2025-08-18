#!/usr/bin/env node
/**
 * make_theaters_events_raw.js
 *
 * Вход : events.csv (строчные данные по каждому показу)
 * Выход: theatersEventsRaw.ts (TS-модуль с типом и массивом показов)
 *
 * Поддерживаемые столбцы (рус/англ, регистр/пробелы не важны):
 * - ID (ИНН театра)
 * - Theater Name (название театра)        [опц.]
 * - Year (год)                             [если нет — возьмём из Date/Date and Time]
 * - Month (месяц: Jan/янв/Январь/1..12)    [опц., если нет — посчитаем]
 * - Date (дд.мм.гггг)                      [опц., если нет — из Date and Time]
 * - Date and Time (ISO, можно с [Europe/Moscow])
 * - Event Name (название мероприятия)
 * - Venue Name (площадка/сцена)
 * - Main Stage (Да/Нет/TRUE/FALSE/1/0)     [опц.]
 * - Sales (выручка)
 * - Tickets (проданные билеты)
 * - Venue Space (вместимость/места)
 * - Event Count (сеансов=1 на строку — обычно 1)
 * - Season (сезон, число или строка)       [опц.]
 * - Ended (Да/Нет/TRUE/FALSE/1/0)          [опц.]
 * - Average Price (ср. цена билета)        [опц.]
 * - OtherEventType (TRUE/FALSE или текст)  [опц., для «прочих» событий]
 */

import fs from 'fs/promises';
import path from 'path';

/* ---------------- CLI args ---------------- */
const argv = process.argv.slice(2);
function arg(name, def) {
	const i = argv.findIndex((a) => a === `--${name}`);
	return i !== -1 ? argv[i + 1] : def;
}
const SOURCE = arg('src', 'eventsDetailed.csv');
const TARGET = arg('out', 'theatersEventsRaw.ts');
const EXPORT = arg('export', 'theatersEventsRaw');

/* --------------- CSV parser --------------- */
function parseCSV(text) {
	const rows = [];
	let row = [],
		cell = '',
		q = false;
	const delim = text.includes(';') ? ';' : ',';

	for (let i = 0; i < text.length; i++) {
		const ch = text[i];
		if (ch === '"') {
			if (q && text[i + 1] === '"') {
				cell += '"';
				i++;
			} else q = !q;
		} else if (ch === delim && !q) {
			row.push(cell);
			cell = '';
		} else if ((ch === '\n' || ch === '\r') && !q) {
			if (ch === '\r' && text[i + 1] === '\n') i++;
			row.push(cell);
			rows.push(row);
			row = [];
			cell = '';
		} else cell += ch;
	}
	if (cell !== '' || row.length) {
		row.push(cell);
		rows.push(row);
	}
	return rows;
}

/* --------------- helpers ------------------ */
const SPACES_RX = /[ \u00A0]/g;

function toNumber(raw, { allowEmpty = false } = {}) {
	if (raw == null) return allowEmpty ? undefined : 0;
	const s = String(raw).replace(SPACES_RX, '').replace(',', '.').trim();
	if (s === '') return allowEmpty ? undefined : 0;
	const n = Number(s);
	return Number.isFinite(n) ? n : allowEmpty ? undefined : 0;
}

function toInt(raw, { allowEmpty = false } = {}) {
	const n = toNumber(raw, { allowEmpty });
	return n == null ? undefined : Math.trunc(n);
}

function toBool(raw) {
	if (raw == null) return undefined;
	const s = String(raw).trim().toLowerCase();
	if (!s) return undefined;
	if (['да', 'yes', 'true', '1', 'y', 't'].includes(s)) return true;
	if (['нет', 'no', 'false', '0', 'n', 'f'].includes(s)) return false;
	return undefined;
}

// TRUE/FALSE или текст-метка — вернём boolean либо сам текст
function toBoolOrText(raw) {
	if (raw == null) return undefined;
	const s = String(raw).trim();
	if (!s) return undefined;
	const b = toBool(s);
	return b === undefined ? s : b;
}

const MONTHS = {
	// ru short
	янв: 1,
	фев: 2,
	мар: 3,
	апр: 4,
	май: 5,
	июн: 6,
	июл: 7,
	авг: 8,
	сен: 9,
	окт: 10,
	ноя: 11,
	дек: 12,
	// ru long
	январь: 1,
	февраль: 2,
	март: 3,
	апрель: 4,
	май: 5,
	июнь: 6,
	июль: 7,
	август: 8,
	сентябрь: 9,
	октябрь: 10,
	ноябрь: 11,
	декабрь: 12,
	// en short
	jan: 1,
	feb: 2,
	mar: 3,
	apr: 4,
	may: 5,
	jun: 6,
	jul: 7,
	aug: 8,
	sep: 9,
	oct: 10,
	nov: 11,
	dec: 12,
	// en long
	january: 1,
	february: 2,
	march: 3,
	april: 4,
	may: 5,
	june: 6,
	july: 7,
	august: 8,
	september: 9,
	october: 10,
	november: 11,
	december: 12
};

function parseMonth(raw) {
	if (raw == null) return undefined;
	const s = String(raw).trim();
	if (!s) return undefined;
	const n = Number(s);
	if (Number.isFinite(n) && n >= 1 && n <= 12) return n;
	const key = s.toLowerCase();
	return MONTHS[key];
}

function parseDateDDMMYYYY(raw) {
	if (raw == null) return undefined;
	const s = String(raw).trim();
	const m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
	if (!m) return undefined;
	const [, dd, mm, yyyy] = m;
	const d = dd.padStart(2, '0'),
		m2 = mm.padStart(2, '0');
	return `${yyyy}-${m2}-${d}`;
}

function cleanZonedDateTime(raw) {
	// "2024-01-02T19:00+03:00[Europe/Moscow]" -> "2024-01-02T19:00+03:00"
	if (raw == null) return undefined;
	const s = String(raw).trim();
	if (!s) return undefined;
	const i = s.indexOf('[');
	return i > 0 ? s.slice(0, i) : s;
}

/** мягкий поиск индекса столбца по набору вариантов */
function findIndex(headers, variants) {
	const normalized = headers.map((h) =>
		String(h || '')
			.trim()
			.toLowerCase()
	);
	for (const v of variants) {
		const idx = normalized.findIndex((h) => h === v || h.startsWith(v));
		if (idx !== -1) return idx;
	}
	return -1;
}

/* --------------- main -------------------- */
(async () => {
	let csv = await fs.readFile(SOURCE, 'utf8');
	if (csv.charCodeAt(0) === 0xfeff) csv = csv.slice(1);

	const [headers, ...lines] = parseCSV(csv);
	if (!headers || !headers.length) {
		throw new Error('Файл пуст или не содержит заголовков');
	}

	// Индексы столбцов (гибкие варианты)
	const idx = {
		id: findIndex(headers, ['id', 'инн', 'inn', 'ид', 'код']),
		theaterName: findIndex(headers, ['theater name', 'название театра', 'театр']),
		year: findIndex(headers, ['year', 'год']),
		month: findIndex(headers, ['month', 'месяц']),
		date: findIndex(headers, ['date', 'дата']),
		datetime: findIndex(headers, ['date and time', 'datetime', 'дата и время']),
		title: findIndex(headers, [
			'event name',
			'наименование мероприятия',
			'спектакль',
			'название события'
		]),
		hall: findIndex(headers, [
			'venue name',
			'площадка',
			'зал',
			'наименование зала',
			'наименование зала_ред'
		]),
		mainStage: findIndex(headers, ['main stage', 'основная сцена', 'главная сцена']),
		sales: findIndex(headers, ['sales', 'поступление', 'выручка']),
		tickets: findIndex(headers, ['tickets', 'билетов', 'кол-во проданных билетов']),
		seats: findIndex(headers, [
			'venue space',
			'мест',
			'количество мест',
			'capacity',
			'вместимость',
			'venue'
		]),
		eventCount: findIndex(headers, ['event count', 'сеансов', 'показов', 'count']),
		season: findIndex(headers, ['season', 'сезон']),
		ended: findIndex(headers, ['ended', 'заверш', 'ended?']),
		avgPrice: findIndex(headers, ['average price', 'средняя цена', 'avg price', 'avg']),
		otherEventType: findIndex(headers, [
			'othereventtype',
			'other event',
			'other type',
			'проч',
			'друг',
			'не спектакль'
		])
	};

	const rows = [];
	for (const row of lines) {
		if (!row || !row.some((c) => String(c || '').trim())) continue; // пустая строка

		const theaterId = idx.id !== -1 ? toInt(row[idx.id]) : undefined;
		const theaterName = idx.theaterName !== -1 ? String(row[idx.theaterName]).trim() : undefined;

		// даты
		const rawDate = idx.date !== -1 ? String(row[idx.date]).trim() : undefined;
		const ymdFromDate = rawDate ? parseDateDDMMYYYY(rawDate) : undefined;
		const rawDateTime = idx.datetime !== -1 ? String(row[idx.datetime]).trim() : undefined;
		const isoDateTime = cleanZonedDateTime(rawDateTime);

		// год/месяц
		const year =
			(idx.year !== -1 ? toInt(row[idx.year], { allowEmpty: true }) : undefined) ??
			(ymdFromDate ? Number(ymdFromDate.slice(0, 4)) : undefined) ??
			(isoDateTime ? Number(isoDateTime.slice(0, 4)) : undefined);

		let month =
			(idx.month !== -1 ? parseMonth(row[idx.month]) : undefined) ??
			(ymdFromDate ? Number(ymdFromDate.slice(5, 7)) : undefined) ??
			(isoDateTime ? Number(isoDateTime.slice(5, 7)) : undefined);

		// если Month пришёл текстом неизвестной формы — попытка как число
		if (!month && idx.month !== -1) {
			const maybe = toInt(row[idx.month], { allowEmpty: true });
			if (maybe && maybe >= 1 && maybe <= 12) month = maybe;
		}

		// ymd (YYYY-MM-DD)
		const ymd = ymdFromDate ?? (isoDateTime ? isoDateTime.slice(0, 10) : undefined);

		const title = idx.title !== -1 ? String(row[idx.title]).trim() : undefined;
		const hall = idx.hall !== -1 ? String(row[idx.hall]).trim() : undefined;

		const mainStage = idx.mainStage !== -1 ? toBool(row[idx.mainStage]) : undefined;

		const sales = idx.sales !== -1 ? toNumber(row[idx.sales]) : 0;
		const tickets = idx.tickets !== -1 ? toInt(row[idx.tickets]) : 0;
		const seats = idx.seats !== -1 ? toInt(row[idx.seats]) : undefined;

		const eventCount =
			idx.eventCount !== -1 ? toInt(row[idx.eventCount], { allowEmpty: true }) : undefined;

		const season = idx.season !== -1 ? String(row[idx.season]).trim() || undefined : undefined;
		const ended = idx.ended !== -1 ? toBool(row[idx.ended]) : undefined;

		const avgPrice =
			idx.avgPrice !== -1 ? toNumber(row[idx.avgPrice], { allowEmpty: true }) : undefined;

		const otherEventType =
			idx.otherEventType !== -1 ? toBoolOrText(row[idx.otherEventType]) : undefined;

		rows.push({
			theaterId,
			theaterName,
			year,
			month,
			ymd, // YYYY-MM-DD
			dateTime: isoDateTime, // ISO без [Europe/...]
			title,
			hall,
			mainStage,
			sales,
			tickets,
			seats,
			eventCount,
			season,
			ended,
			avgPrice,
			otherEventType
		});
	}

	// Удалим совсем пустые/бракованные записи без id/даты/названия
	const clean = rows.filter(
		(r) =>
			typeof r.theaterId === 'number' &&
			typeof r.year === 'number' &&
			r.title &&
			r.title.length > 0 &&
			r.hall &&
			r.hall.length > 0 &&
			(r.ymd || r.dateTime)
	);

	// Соберём TypeScript-вывод
	const header = `// Auto-generated on ${new Date().toISOString()}
export type TheaterShowingRaw = {
  theaterId: number;
  theaterName?: string;
  year: number;
  month?: number;          // 1-12
  ymd?: string;            // YYYY-MM-DD
  dateTime?: string;       // ISO-8601 с оффсетом, без суффикса [Zone]
  title: string;           // название мероприятия
  hall: string;            // площадка/зал
  mainStage?: boolean;
  sales: number;
  tickets: number;
  seats?: number;          // вместимость
  eventCount?: number;     // как правило 1
  season?: string;
  ended?: boolean;
  avgPrice?: number;
  otherEventType?: boolean | string; // TRUE/FALSE или текстовая метка («концерт», «встреча»)
};

`;

	const body = `export const ${EXPORT}: TheaterShowingRaw[] = ${JSON.stringify(clean, null, 2)}; 
`;

	const out = header + body;
	await fs.writeFile(TARGET, out, 'utf8');

	console.log(`✅ ${TARGET} создан.`);
	console.log(`   Всего строк в CSV: ${lines.length}`);
	console.log(`   Принято к экспорту: ${clean.length}`);
	if (clean.length !== rows.length) {
		console.log(`   Отфильтровано как брак: ${rows.length - clean.length}`);
	}
})().catch((err) => {
	console.error('❌ Ошибка:', err);
	process.exit(1);
});
