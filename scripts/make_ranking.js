#!/usr/bin/env node
/**
 * make_ranking.js
 * Преобразует ranking.csv → RANKING.js
 *
 * CSV-структура (порядок столбцов произвольный, регистр не важен):
 * ┌───────────┬─────────────────┬──────────────────┐
 * │ ID_театра │ rankRevenue2024 │ rankRevenue2025  │
 * │ rankTickets2024 │ rankTickets2025 │ revenue2024 │ revenue2025 │
 * │ tickets2024 │ tickets2025  │
 * └───────────┴─────────────────┴──────────────────┘
 *
 * Любые лишние столбцы также попадут в итоговый объект.
 */

import fs from 'fs/promises';

/* ---------- мини-CSV-парсер (; или ,  + кавычки) ------------------ */
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
			} // "" → "
			else q = !q;
		} else if (ch === delim && !q) {
			row.push(cell);
			cell = '';
		} else if ((ch === '\n' || ch === '\r') && !q) {
			if (ch === '\r' && text[i + 1] === '\n') i++; // CRLF
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

/* ---------- настройки -------------------------------------------- */
const SOURCE = 'ranking.csv';
const TARGET = 'ranking.js';
const EXPORT = 'ranking'; // имя экспортируемой переменной

/* ---------- основная логика -------------------------------------- */
(async () => {
	let csv = await fs.readFile(SOURCE, 'utf8');
	if (csv.charCodeAt(0) === 0xfeff) csv = csv.slice(1); // убираем BOM

	const [headers, ...lines] = parseCSV(csv);

	// Подготовим заголовки без пробелов
	const cleanHeaders = headers.map((h) => h.trim());

	// Собираем объекты построчно
	const ranking = lines
		.filter((r) => r.some((c) => c.trim())) // пропуск пустых строк
		.map((row) => {
			const obj = {};
			cleanHeaders.forEach((key, i) => {
				const raw = row[i]?.trim() ?? '';
				// Попробуем auto-number
				const num = Number(raw.replace(/\s+/g, ''));
				obj[key === 'ID_театра' ? 'id' : key] = !isNaN(num) && raw !== '' ? num : raw;
			});
			return obj;
		});

	const out =
		`// Auto-generated on ${new Date().toISOString()}\n` +
		`export const ${EXPORT} = ${JSON.stringify(ranking, null, 2)};\n`;

	await fs.writeFile(TARGET, out, 'utf8');
	console.log(`✅ ${TARGET} создан. Строк: ${ranking.length}`);
})().catch((err) => {
	console.error(err);
	process.exit(1);
});
