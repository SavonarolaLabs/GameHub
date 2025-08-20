#!/usr/bin/env node
/**
 * make_theaters_expenses.js
 *
 * Вход:  theatersExpenses.csv
 *   Колонки (англ/рус поддерживаются, порядок не важен):
 *   - year / год
 *   - id / inn / ИНН
 *   - title / название  (не используется в выходе)
 *   - total value
 *   - fot value, transport value, rent value, gph value, events value, royalties value
 *   - total share
 *   - fot share, transport share, rent share, gph share, events share, royalties share
 *   - total avgShare
 *   - fot avgShare, transport avgShare, rent avgShare, gph avgShare, events avgShare, royalties avgShare
 *
 * Числа могут быть с пробелами как разделителями тысяч и запятой как десятичным разделителем.
 *
 * Выход: theatersExpenses.js
 *   export const theatersExpenses = [ { id, years:[ {year,total,breakdown:{...}} ] }, ... ];
 */

import fs from 'fs/promises';

/* -------- мини CSV-парсер (; или ,  + кавычки) -------- */
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

/* -------- строка -> число (убираем пробелы, ',' -> '.') -------- */
function toNumber(str) {
	if (str == null) return 0;
	const s = String(str).replace(/\s+/g, '').replace(',', '.').trim();
	if (s === '' || s === '-') return 0;
	const n = Number(s);
	return Number.isFinite(n) ? n : 0;
}

/* -------- нормализация заголовков -------- */
function norm(h) {
	return String(h || '')
		.toLowerCase()
		.replace(/\u00A0/g, ' ')
		.replace(/\s+/g, ' ')
		.replace(/[._-]+/g, ' ')
		.trim();
}

/* поиск индекса колонки по предикату над нормализованной строкой */
function findIdx(headers, pred, required = true, nameForError = 'column') {
	const i = headers.findIndex((h) => pred(norm(h)));
	if (required && i === -1) {
		throw new Error(`Не найдена колонка: ${nameForError}`);
	}
	return i;
}

/* -------- настройки файлов -------- */
const SOURCE = process.argv[2] || 'Expences_20.08.2025.csv';
const TARGET = process.argv[3] || 'theatersExpenses.js';
const EXPORT = 'theatersExpenses';

const CATEGORIES = ['fot', 'transport', 'rent', 'gph', 'events', 'royalties'];

(async () => {
	let csv = await fs.readFile(SOURCE, 'utf8');
	if (csv.charCodeAt(0) === 0xfeff) csv = csv.slice(1); // BOM

	const [rawHeaders, ...lines] = parseCSV(csv);
	if (!rawHeaders || !rawHeaders.length) throw new Error('Пустой CSV');

	/* индексы обязательных колонок (поддержка англ/рус) */
	const idIdx = findIdx(
		rawHeaders,
		(h) => h === 'id' || h.includes('инн') || h === 'inn',
		true,
		'id/inn'
	);
	const yearIdx = findIdx(rawHeaders, (h) => h === 'year' || h === 'год', true, 'year/год');

	/* индекс total value */
	const totalValueIdx = findIdx(
		rawHeaders,
		(h) =>
			(h.includes('total') || h.includes('итого') || h.includes('всего')) && h.includes('value'),
		true,
		'total value'
	);

	/* индексы долей (share) и средних долей (avgShare) по категориям */
	const headerNorm = rawHeaders.map(norm);

	function findCatIndex(cat, kind /* 'value' | 'share' | 'avgshare' */) {
		const pred = (h) =>
			h.includes(cat) &&
			(kind === 'value'
				? h.includes('value')
				: kind === 'share'
					? h.includes('share') && !h.includes('avg')
					: h.includes('avgshare') || (h.includes('avg') && h.includes('share')));

		return findIdx(rawHeaders, (h) => pred(norm(h)), false);
	}

	const catIdx = {
		value: Object.fromEntries(CATEGORIES.map((c) => [c, findCatIndex(c, 'value')])),
		share: Object.fromEntries(CATEGORIES.map((c) => [c, findCatIndex(c, 'share')])),
		avgShare: Object.fromEntries(CATEGORIES.map((c) => [c, findCatIndex(c, 'avgshare')]))
	};

	/* группируем по театрам и годам */
	const byTheater = new Map(); // id -> { id, years: Map(year -> data) }

	for (const row of lines) {
		if (!row || !row.some((c) => String(c || '').trim())) continue;

		const id = Number(String(row[idIdx] || '').trim());
		const year = Number(String(row[yearIdx] || '').trim());
		if (!Number.isFinite(id) || !Number.isFinite(year)) continue;

		const total = toNumber(row[totalValueIdx]);

		const breakdown = {};
		for (const c of CATEGORIES) {
			const vIdx = catIdx.value[c];
			const sIdx = catIdx.share[c];
			const aIdx = catIdx.avgShare[c];
			breakdown[c] = {
				value: vIdx != null && vIdx !== -1 ? toNumber(row[vIdx]) : 0,
				share: sIdx != null && sIdx !== -1 ? toNumber(row[sIdx]) : 0,
				avgShare: aIdx != null && aIdx !== -1 ? toNumber(row[aIdx]) : 0
			};
		}

		if (!byTheater.has(id)) byTheater.set(id, { id, years: new Map() });
		const rec = byTheater.get(id);

		// Если по (id, year) встречается несколько строк — последняя побеждает
		rec.years.set(year, { year, total, breakdown });
	}

	/* финальный массив + сортировка лет по возрастанию */
	const result = [...byTheater.values()].map((t) => ({
		id: t.id,
		years: [...t.years.values()].sort((a, b) => a.year - b.year)
	}));

	const out =
		`// Auto-generated on ${new Date().toISOString()}\n` +
		`export const ${EXPORT} = ${JSON.stringify(result, null, 2)};\n`;

	await fs.writeFile(TARGET, out, 'utf8');
	console.log(`✅ ${TARGET} создан. Театров: ${result.length}`);
})().catch((err) => {
	console.error('❌ Ошибка:', err.message);
	process.exit(1);
});
