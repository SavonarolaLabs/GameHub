#!/usr/bin/env node
/**
 * make_theaters_premiers.js
 *
 * Вход : premiers.csv
 *        (ID_театра;Название премьеры;Площадка;Дата начала;Дата окончания;Ссылка на премьеру)
 * Выход: THEATERS_PREMIERS.js
 *        export const theatersPremiers = [ { id, premiers:[{…}] }, … ];
 */

import fs from 'fs/promises';

/* -------- простой CSV-парсер (;|,  + кавычки) -------------------- */
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

/* -------- настройки файлов -------------------------------------- */
const SOURCE = 'premiers.csv';
const TARGET = 'theatersPremiers.js';
const EXPORT = 'theatersPremiers';

/* -------- основная логика --------------------------------------- */
(async () => {
	let csv = await fs.readFile(SOURCE, 'utf8');
	if (csv.charCodeAt(0) === 0xfeff) csv = csv.slice(1); // убираем BOM

	const [headers, ...lines] = parseCSV(csv);

	/* --- находим индексы ключевых столбцов (регистр ±, пробелы ±) --- */
	const idx = {
		id: headers.findIndex((h) => h.trim().toLowerCase().startsWith('id')),
		name: headers.findIndex((h) => h.trim().toLowerCase().includes('название')),
		venue: headers.findIndex((h) => h.trim().toLowerCase().includes('площад')),
		start: headers.findIndex((h) => h.trim().toLowerCase().includes('начал')),
		end: headers.findIndex((h) => h.trim().toLowerCase().includes('оконч')),
		link: headers.findIndex((h) => h.trim().toLowerCase().includes('ссыл'))
	};

	/* --- группируем по театру -------------------------------------- */
	const map = new Map();
	for (const row of lines) {
		if (!row.some((c) => c.trim())) continue; // пропускаем пустые
		const id = Number(row[idx.id].trim());
		if (!map.has(id)) map.set(id, []);
		map.get(id).push({
			name: row[idx.name].trim(),
			venue: row[idx.venue].trim(),
			startDate: row[idx.start].trim(),
			endDate: row[idx.end].trim(),
			link: row[idx.link].trim()
		});
	}

	/* --- итоговый массив ------------------------------------------- */
	const theatersPremiers = [...map.entries()].map(([id, premiers]) => ({ id, premiers }));

	/* --- пишем JS-файл --------------------------------------------- */
	const out =
		`// Auto-generated on ${new Date().toISOString()}\n` +
		`export const ${EXPORT} = ${JSON.stringify(theatersPremiers, null, 2)};\n`;

	await fs.writeFile(TARGET, out, 'utf8');
	console.log(`✅ ${TARGET} создан. Театров: ${theatersPremiers.length}`);
})().catch((err) => {
	console.error(err);
	process.exit(1);
});
