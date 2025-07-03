#!/usr/bin/env node
/**
 * make_theater_socials.js
 * Запуск: node make_theater_socials.js   # или bun run …
 *
 * Вход : socials.csv  (ID_театра;Соцсеть;Ссылка;Иконка)
 * Выход: THEATER_SOCIALS.js  c export const theaterSocials = …
 */

import fs from 'fs/promises';

/* ----- вспомогательный CSV-парсер (; или ,  + кавычки) ----- */
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

/* ----- основной код ----- */
(async () => {
	let csv = await fs.readFile('socials.csv', 'utf8');
	if (csv.charCodeAt(0) === 0xfeff) csv = csv.slice(1); // срезаем BOM

	const [headers, ...lines] = parseCSV(csv);

	// Индексы нужных колонок
	const idx = {
		id: headers.findIndex((h) => h.trim().toLowerCase().startsWith('id')),
		name: headers.findIndex((h) => h.trim().toLowerCase().startsWith('соц')),
		link: headers.findIndex((h) => h.trim().toLowerCase().startsWith('ссыл')),
		photo: headers.findIndex((h) => h.trim().toLowerCase().startsWith('икон'))
	};

	// Группируем по id
	const map = new Map();
	for (const row of lines) {
		if (!row.some((c) => c.trim())) continue; // пустая строка
		const id = Number(row[idx.id].trim());
		if (!map.has(id)) map.set(id, []);
		map.get(id).push({
			name: row[idx.name].trim(),
			link: row[idx.link].trim(),
			photo: row[idx.photo].trim()
		});
	}

	// Собираем итоговый массив
	const theaterSocials = [...map.entries()].map(([id, socials]) => ({ id, socials }));

	// Пишем JS-файл
	const out =
		`// Auto-generated on ${new Date().toISOString()}\n` +
		`export const theaterSocials = ${JSON.stringify(theaterSocials, null, 2)};\n`;

	await fs.writeFile('THEATER_SOCIALS.js', out, 'utf8');
	console.log(`✅ THEATER_SOCIALS.js создан. Театров: ${theaterSocials.length}`);
})().catch((err) => {
	console.error(err);
	process.exit(1);
});
