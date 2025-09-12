#!/usr/bin/env node
/**
 * make_theaters_staff.js
 *
 * Вход : staff.csv
 *        (ИНН театра;Название театра;Сколько лет существует театр;Наличие гастролей...;Общее количество сотрудников из них;Административный персонал;Количество художественного персонала;Количество артистов;Прочий персонал)
 * Выход: theatersStaff.js
 *        export const theatersStaff = [
 *          {
 *            id,
 *            name,
 *            meta: { ageYears, hasTouringRU },
 *            staff: { total, admin, artistic, artists, other }
 *          }, ...
 *        ];
 */

import fs from 'fs/promises';

/* -------- простой CSV-парсер (;|, + кавычки) -------------------- */
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

/* -------- утилиты ----------------------------------------------- */
const SOURCE = 'staff.csv';
const TARGET = 'theatersStaff.js';
const EXPORT = 'theatersStaff';

const normalize = (s) =>
	String(s ?? '')
		.replace(/\u00A0/g, ' ') // NBSP → space
		.replace(/\s+/g, ' ') // множественные пробелы
		.trim();

const toNumber = (s) => {
	const cleaned = normalize(s)
		.replace(/[^\d.,\-]/g, '')
		.replace(',', '.');
	const n = Number(cleaned);
	return Number.isFinite(n) ? n : 0;
};

const toBoolYes = (s) => /^(да|yes|true|есть)$/i.test(normalize(s));

/* -------- основная логика --------------------------------------- */
(async () => {
	let csv = await fs.readFile(SOURCE, 'utf8');
	if (csv.charCodeAt(0) === 0xfeff) csv = csv.slice(1); // убираем BOM

	const [headers, ...lines] = parseCSV(csv);
	if (!headers) throw new Error('В файле нет заголовка');

	const H = headers.map((h) => normalize(h).toLowerCase().replace(/ё/g, 'е'));

	const find = (...keys) => H.findIndex((h) => keys.some((k) => h.includes(k)));

	const idx = {
		id: find('инн'),
		name: find('назван'),
		age: find('лет', 'существ', 'возраст'),
		touring: find('гастрол'),
		total: find('общее количество сотрудников'),
		admin: find('административ'),
		artistic: find('художе'), // «Количество художественного персонала»
		artists: find('артист'),
		other: find('прочий персонал', 'прочий', 'прочее')
	};

	const required = ['id', 'name', 'total'];
	for (const k of required) {
		if (idx[k] === -1) {
			throw new Error(`Не найден обязательный столбец: ${k}. Заголовки: ${headers.join(' | ')}`);
		}
	}

	const rows = [];
	for (const row of lines) {
		if (!row || !row.some((c) => normalize(c))) continue;

		const idRaw = (row[idx.id] ?? '').toString();
		const id = Number(idRaw.replace(/[^\d]/g, '')); // ИНН как число
		const name = normalize(row[idx.name]);

		const ageYears = idx.age !== -1 ? toNumber(row[idx.age]) : null;
		const hasTouringRU = idx.touring !== -1 ? toBoolYes(row[idx.touring]) : false;

		const total = toNumber(row[idx.total]);
		const admin = idx.admin !== -1 ? toNumber(row[idx.admin]) : 0;
		const artistic = idx.artistic !== -1 ? toNumber(row[idx.artistic]) : 0;
		const artists = idx.artists !== -1 ? toNumber(row[idx.artists]) : 0;

		let other = idx.other !== -1 ? toNumber(row[idx.other]) : null;
		if (other == null || !Number.isFinite(other)) {
			// если «прочий» не задан — досчитаем от total
			const sumKnown = admin + artistic + artists;
			other = Math.max(0, total - sumKnown);
		}

		rows.push({
			id,
			name,
			meta: {
				ageYears: Number.isFinite(ageYears) ? ageYears : null,
				hasTouringRU
			},
			staff: {
				total,
				admin,
				artistic,
				artists,
				other
			}
		});
	}

	const out =
		`// Auto-generated on ${new Date().toISOString()}\n` +
		`export const ${EXPORT} = ${JSON.stringify(rows, null, 2)};\n`;

	await fs.writeFile(TARGET, out, 'utf8');
	console.log(`✅ ${TARGET} создан. Театров: ${rows.length}`);
})().catch((err) => {
	console.error('❌ Ошибка:', err.message);
	process.exit(1);
});
