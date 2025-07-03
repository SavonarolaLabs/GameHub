#!/usr/bin/env node
/**
 * make_ticket_operator.js
 *
 * Вход : operators.csv  (ID_театра;Билетный оператор;Доля оператора;Иконка)
 * Выход: TICKET_OPERATOR.js  c export const ticketOperator = …
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
		} else {
			cell += ch;
		}
	}
	if (cell !== '' || row.length) {
		row.push(cell);
		rows.push(row);
	}
	return rows;
}

/* -------- основная логика --------------------------------------- */
(async () => {
	let csv = await fs.readFile('ticketOperator.csv', 'utf8'); // ← имя входного файла
	if (csv.charCodeAt(0) === 0xfeff) csv = csv.slice(1); // убираем BOM

	const [headers, ...lines] = parseCSV(csv);

	/* --- определяем позиции нужных колонок (регистр/пробелы не важны) --- */
	const idx = {
		id: headers.findIndex((h) => h.trim().toLowerCase().startsWith('id')),
		name: headers.findIndex((h) => h.trim().toLowerCase().includes('билетн')),
		share: headers.findIndex((h) => h.trim().toLowerCase().includes('доля')),
		icon: headers.findIndex((h) => h.trim().toLowerCase().includes('икон'))
	};

	/* --- группируем строки по id театра ------------------------------ */
	const map = new Map();
	for (const row of lines) {
		if (!row.some((c) => c.trim())) continue; // пропускаем пустые
		const id = Number(row[idx.id].trim());
		if (!map.has(id)) map.set(id, []);
		map.get(id).push({
			name: row[idx.name].trim(),
			share: row[idx.share].trim(),
			icon: row[idx.icon].trim()
		});
	}

	/* --- итоговая структура ----------------------------------------- */
	const ticketOperator = [...map.entries()].map(([id, operators]) => ({
		id,
		operators
	}));

	/* --- запись JS-файла -------------------------------------------- */
	const out =
		`// Auto-generated on ${new Date().toISOString()}\n` +
		`export const ticketOperator = ${JSON.stringify(ticketOperator, null, 2)};\n`;

	await fs.writeFile('ticketOperator.js', out, 'utf8');
	console.log(`✅ ticketOperator.js создан. Театров: ${ticketOperator.length}`);
})().catch((err) => {
	console.error(err);
	process.exit(1);
});
