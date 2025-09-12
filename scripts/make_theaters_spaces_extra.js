#!/usr/bin/env node
/**
 * make_theaters_spaces_extra.js
 *
 * Вход : spaces_extra.(csv|tsv)
 *        (ID_театра;Название;venue_space_short_name_address;id;venue_space_short_name;Округ;Район;MapsLink;ЖАНР;
 *         Ближайшая станция метро;Удаленность от метро в минутах;наличие кафе при театре;наличие буфета при театре;наличие сувенирного магазина при театре)
 *
 * Выход: theatersSpacesExtra.js
 *        export const theatersSpacesExtra = [ { id, spaces:[{…}] }, … ];
 */

import fs from 'fs/promises';

/* ---------- утилиты ---------- */
const SOURCE = process.argv[2] || 'spaces_extra.csv';
const TARGET = 'theatersSpacesExtra.js';
const EXPORT = 'theatersSpacesExtra';

const norm = (s) => (s ?? '').toString().trim().toLowerCase();
const toInt = (v) => {
	const n = Number((v ?? '').toString().replace(',', '.').trim());
	return Number.isFinite(n) ? n : null;
};
const toBool = (v) => {
	const s = norm(v);
	if (!s) return null;
	if (['да', 'yes', 'true', '1', 'есть'].includes(s)) return true;
	if (['нет', 'no', 'false', '0', 'отсутствует'].includes(s)) return false;
	return null;
};

/* ---------- детектор разделителя ---------- */
function detectDelimiter(text) {
	const firstLine = text.split(/\r?\n/)[0] || '';
	const counts = {
		'\t': (firstLine.match(/\t/g) || []).length,
		';': (firstLine.match(/;/g) || []).length,
		',': (firstLine.match(/,/g) || []).length
	};
	// выбираем самый частый
	return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] || ';';
}

/* ---------- простой CSV/TSV-парсер ---------- */
function parseCSV(text) {
	const rows = [];
	let row = [],
		cell = '',
		q = false;

	const delim = detectDelimiter(text);
	const respectQuotes = delim !== '\t'; // в TSV кавычки не учитываем

	for (let i = 0; i < text.length; i++) {
		const ch = text[i];

		if (respectQuotes && ch === '"') {
			if (q && text[i + 1] === '"') {
				cell += '"';
				i++;
			} else {
				q = !q;
			}
			continue;
		}

		if (ch === delim && !q) {
			row.push(cell);
			cell = '';
			continue;
		}

		if ((ch === '\n' || ch === '\r') && !q) {
			if (ch === '\r' && text[i + 1] === '\n') i++;
			row.push(cell);
			rows.push(row);
			row = [];
			cell = '';
			continue;
		}

		cell += ch;
	}
	if (cell !== '' || row.length) {
		row.push(cell);
		rows.push(row);
	}
	return rows;
}

/* ---------- основная логика ---------- */
(async () => {
	let csv = await fs.readFile(SOURCE, 'utf8');
	if (csv.charCodeAt(0) === 0xfeff) csv = csv.slice(1); // убираем BOM

	const [headers, ...lines] = parseCSV(csv);
	if (!headers) throw new Error('Файл пустой или без заголовков');

	// индексы столбцов (толерантны к регистру и вариантам названий)
	const idx = {
		theaterId: headers.findIndex((h) => /id[_\s-]*театра|инн/.test(norm(h))),
		address: headers.findIndex((h) => /address|адрес|venue_space_short_name_address/.test(norm(h))),
		spaceId: headers.findIndex((h) => norm(h) === 'id' || /space[_\s-]*id/.test(norm(h))),
		spaceName: headers.findIndex((h) =>
			/venue[_\s-]*space[_\s-]*short[_\s-]*name|сцена|площадка/.test(norm(h))
		),
		okrug: headers.findIndex((h) => /округ/.test(norm(h))),
		district: headers.findIndex((h) => /район/.test(norm(h))),
		maps: headers.findIndex((h) => /maps?link|карты|ссылка.*карты/.test(norm(h))),
		genre: headers.findIndex((h) => /жанр/.test(norm(h))),
		metro: headers.findIndex((h) => /метро/.test(norm(h)) && !/минут/.test(norm(h))),
		walkMin: headers.findIndex((h) => /минут|удален|пешк|в\s*мин/.test(norm(h))),
		cafe: headers.findIndex((h) => /кафе/.test(norm(h))),
		buffet: headers.findIndex((h) => /буфет/.test(norm(h))),
		souvenir: headers.findIndex((h) => /сувенир/.test(norm(h)))
	};

	// минимальные обязательные поля
	const required = ['theaterId', 'spaceId', 'spaceName'];
	for (const k of required) {
		if (idx[k] === -1) {
			throw new Error(`Не найден обязательный столбец: ${k}. Заголовки: ${headers.join(' | ')}`);
		}
	}

	// группируем по театру
	const map = new Map(); // theaterId -> spaces[]
	for (const row of lines) {
		if (!row || !row.some((c) => (c ?? '').toString().trim())) continue;

		const theaterId = toInt(row[idx.theaterId]);
		if (!theaterId) continue;

		const space = {
			spaceId: toInt(row[idx.spaceId]),
			venue_space_short_name: (row[idx.spaceName] ?? '').toString().trim(),
			address: idx.address !== -1 ? (row[idx.address] ?? '').toString().trim() : undefined,
			okrug: idx.okrug !== -1 ? (row[idx.okrug] ?? '').toString().trim() : undefined,
			district: idx.district !== -1 ? (row[idx.district] ?? '').toString().trim() : undefined,
			maps_link: idx.maps !== -1 ? (row[idx.maps] ?? '').toString().trim() : undefined,
			genre: idx.genre !== -1 ? (row[idx.genre] ?? '').toString().trim() : undefined,
			metro: idx.metro !== -1 ? (row[idx.metro] ?? '').toString().trim() : undefined,
			metro_walk_min: idx.walkMin !== -1 ? toInt(row[idx.walkMin]) : null,
			has_cafe: idx.cafe !== -1 ? toBool(row[idx.cafe]) : null,
			has_buffet: idx.buffet !== -1 ? toBool(row[idx.buffet]) : null,
			has_souvenir_shop: idx.souvenir !== -1 ? toBool(row[idx.souvenir]) : null
		};

		if (!map.has(theaterId)) map.set(theaterId, []);
		map.get(theaterId).push(space);
	}

	// результат
	const theatersSpacesExtra = [...map.entries()].map(([id, spaces]) => ({
		id,
		spaces
	}));

	const out =
		`// Auto-generated on ${new Date().toISOString()}\n` +
		`export const ${EXPORT} = ${JSON.stringify(theatersSpacesExtra, null, 2)};\n`;

	await fs.writeFile(TARGET, out, 'utf8');
	console.log(
		`✅ ${TARGET} создан. Театров: ${theatersSpacesExtra.length}, строк: ${lines.length}`
	);
})().catch((err) => {
	console.error('⚠️ Ошибка:', err.message);
	process.exit(1);
});
