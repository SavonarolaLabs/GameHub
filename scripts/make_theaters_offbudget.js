#!/usr/bin/env node
/**
 * make_theaters_offbudget.js
 *
 * Вход: theatersOffbudget.csv
 *   year, id/inn, title (не используется),
 *   total value,
 *   property/tickets/advertising/touring value,
 *   ... share,
 *   ... avgShare
 *
 * Выход: theatersOffbudget.js
 *   export const theatersOffbudget = [ { id, years:[ {year,total,breakdown:{tickets,touring,property,advertising}} ] } ]
 */

import fs from 'fs/promises';

/* --- простой CSV-парсер: ; или , + кавычки --- */
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

/* --- строка -> число (убрать пробелы, запятая -> точка) --- */
function toNumber(str) {
	if (str == null) return 0;
	const s = String(str)
		.replace(/\u00A0/g, ' ')
		.replace(/\s+/g, '')
		.replace(',', '.')
		.trim();
	if (s === '' || s === '-') return 0;
	const n = Number(s);
	return Number.isFinite(n) ? n : 0;
}

/* --- нормализация заголовков --- */
function norm(h) {
	return String(h || '')
		.toLowerCase()
		.replace(/\u00A0/g, ' ')
		.replace(/[._-]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}
function findIdx(headers, pred, required = true, nameForError = 'column') {
	const i = headers.findIndex((h) => pred(norm(h)));
	if (required && i === -1) throw new Error(`Не найдена колонка: ${nameForError}`);
	return i;
}

/* --- файлы и словарь токенов для категорий --- */
const SOURCE = process.argv[2] || 'theatersOffbudget_20.08.2025.csv';
const TARGET = process.argv[3] || 'theatersOffbudget.js';
const EXPORT = 'theatersOffbudget';

const CAT_TOKENS = {
	tickets: ['tickets', 'билет'],
	touring: ['tour', 'гастрол'],
	property: ['property', 'собствен', 'аренд', 'услуг'],
	advertising: ['advert', 'реклам', 'проч']
};

function headerHasAny(h, tokens) {
	return tokens.some((t) => h.includes(t));
}
function findCatFieldIdx(headers, cat, kind /* 'value'|'share'|'avgshare' */) {
	const tokens = CAT_TOKENS[cat];
	return findIdx(
		headers,
		(h) =>
			headerHasAny(h, tokens) &&
			(kind === 'value'
				? h.includes('value')
				: kind === 'share'
					? h.includes('share') && !h.includes('avg')
					: h.includes('avgshare') || (h.includes('avg') && h.includes('share'))),
		false
	);
}

(async () => {
	let csv = await fs.readFile(SOURCE, 'utf8');
	if (csv.charCodeAt(0) === 0xfeff) csv = csv.slice(1);

	const [rawHeaders, ...lines] = parseCSV(csv);
	if (!rawHeaders || !rawHeaders.length) throw new Error('Пустой CSV');

	/* обязательные колонки */
	const idIdx = findIdx(
		rawHeaders,
		(h) => h === 'id' || h === 'inn' || h.includes('инн'),
		true,
		'id/inn'
	);
	const yearIdx = findIdx(rawHeaders, (h) => h === 'year' || h === 'год', true, 'year/год');

	const totalValueIdx = findIdx(
		rawHeaders,
		(h) =>
			(h.includes('total') || h.includes('итого') || h.includes('всего')) && h.includes('value'),
		true,
		'total value'
	);

	/* индексы по категориям */
	const catIdx = {};
	for (const cat of Object.keys(CAT_TOKENS)) {
		catIdx[cat] = {
			value: findCatFieldIdx(rawHeaders, cat, 'value'),
			share: findCatFieldIdx(rawHeaders, cat, 'share'),
			avgShare: findCatFieldIdx(rawHeaders, cat, 'avgshare')
		};
	}

	/* группировка по театрам -> годам */
	const byTheater = new Map(); // id -> { id, years: Map(year -> data) }

	for (const row of lines) {
		if (!row || !row.some((c) => String(c || '').trim())) continue;

		const id = Number(String(row[idIdx] || '').trim());
		const year = Number(String(row[yearIdx] || '').trim());
		if (!Number.isFinite(id) || !Number.isFinite(year)) continue;

		const total = toNumber(row[totalValueIdx]);

		const breakdown = {};
		for (const cat of Object.keys(CAT_TOKENS)) {
			const vIdx = catIdx[cat].value;
			const sIdx = catIdx[cat].share;
			const aIdx = catIdx[cat].avgShare;

			const value = vIdx != null && vIdx !== -1 ? toNumber(row[vIdx]) : 0;
			const share =
				sIdx != null && sIdx !== -1 ? toNumber(row[sIdx]) : total > 0 ? value / total : 0;
			const avgShare = aIdx != null && aIdx !== -1 ? toNumber(row[aIdx]) : 0;

			breakdown[cat] = { value, share, avgShare };
		}

		if (!byTheater.has(id)) byTheater.set(id, { id, years: new Map() });
		byTheater.get(id).years.set(year, { year, total, breakdown });
	}

	/* финальный массив */
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
