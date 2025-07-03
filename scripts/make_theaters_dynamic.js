#!/usr/bin/env node
/**
 * make_theaters_dynamic.js
 *
 * Вход : dynamic.csv
 *        (ID_театра;Год;Месяц;Выручка;Количество)
 * Выход: THEATERS_DYNAMIC.js
 *        export const theatersDynamic = [ { id, dynamic:[{…}] }, … ];
 */

import fs from 'fs/promises';

/* -------- мини-CSV-парсер (; или ,  + кавычки) ------------------- */
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

/* -------- утилита: строка → число (учёт пробелов + русской запятой) */
function toNumber(str) {
	return Number(str.replace(/\s+/g, '').replace(',', '.'));
}

/* -------- настройки файлов -------------------------------------- */
const SOURCE = 'theatersDynamic.csv';
const TARGET = 'theatersDynamic.js';
const EXPORT = 'theatersDynamic';

/* -------- основная логика --------------------------------------- */
(async () => {
	let csv = await fs.readFile(SOURCE, 'utf8');
	if (csv.charCodeAt(0) === 0xfeff) csv = csv.slice(1); // убираем BOM

	const [headers, ...lines] = parseCSV(csv);

	/* --- определяем индексы столбцов (регистр / пробелы не важны) --- */
	const norm = (h) => h.trim().toLowerCase();
	const idx = {
		id: headers.findIndex((h) => norm(h).startsWith('id')),
		year: headers.findIndex((h) => norm(h).startsWith('год')),
		month: headers.findIndex((h) => norm(h).startsWith('месяц')),
		revenue: headers.findIndex((h) => norm(h).includes('выруч')),
		tickets: headers.findIndex((h) => norm(h).includes('колич'))
	};

	/* --- группируем по театрам ------------------------------------- */
	const map = new Map();
	for (const row of lines) {
		if (!row.some((c) => c.trim())) continue; // пропускаем пустые

		const id = Number(row[idx.id].trim());
		if (!map.has(id)) map.set(id, []);

		map.get(id).push({
			year: Number(row[idx.year].trim()),
			month: Number(row[idx.month].trim()),
			revenue: toNumber(row[idx.revenue]),
			tickets: toNumber(row[idx.tickets])
		});
	}

	/* --- сортируем динамику по времени (по желанию) ---------------- */
	for (const arr of map.values()) {
		arr.sort((a, b) => a.year - b.year || a.month - b.month);
	}

	/* --- итоговый массив ------------------------------------------- */
	const theatersDynamic = [...map.entries()].map(([id, dynamic]) => ({ id, dynamic }));

	/* --- запись JS-файла ------------------------------------------- */
	const out =
		`// Auto-generated on ${new Date().toISOString()}\n` +
		`export const ${EXPORT} = ${JSON.stringify(theatersDynamic, null, 2)};\n`;

	await fs.writeFile(TARGET, out, 'utf8');
	console.log(`✅ ${TARGET} создан. Театров: ${theatersDynamic.length}`);
})().catch((err) => {
	console.error(err);
	process.exit(1);
});
