#!/usr/bin/env node
/**
 * make_hr.js
 * Запуск: node make_hr.js   — или  bun run make_hr.js
 */

import fs from 'fs/promises';

// --- 1. Явные соответствия «русский → english» --------------------
const keyMap = {
	ФИО: 'fullName',
	Должность: 'position',
	Организация: 'organization',
	'Инн организации': 'organizationInn',
	HR_ID: 'hrId',
	Фото: 'photo',
	'Начало контракта': 'contractStart',
	До: 'contractEnd',
	Телефон: 'phone',
	Почта: 'email',
	Звания: 'titles',
	'Ссылка на биографию': 'bioUrl',
	'Ссылка на персоналию': 'theatreProfileUrl',
	'Ссылка на вики': 'wikiUrl'
};

// --- 2. Мини-транслитерация + camelCase ---------------------------
function transliterate(str) {
	const map = {
		А: 'A',
		Б: 'B',
		В: 'V',
		Г: 'G',
		Д: 'D',
		Е: 'E',
		Ё: 'E',
		Ж: 'Zh',
		З: 'Z',
		И: 'I',
		Й: 'Y',
		К: 'K',
		Л: 'L',
		М: 'M',
		Н: 'N',
		О: 'O',
		П: 'P',
		Р: 'R',
		С: 'S',
		Т: 'T',
		У: 'U',
		Ф: 'F',
		Х: 'Kh',
		Ц: 'Ts',
		Ч: 'Ch',
		Ш: 'Sh',
		Щ: 'Sch',
		Ъ: '',
		Ы: 'Y',
		Ь: '',
		Э: 'E',
		Ю: 'Yu',
		Я: 'Ya',
		а: 'a',
		б: 'b',
		в: 'v',
		г: 'g',
		д: 'd',
		е: 'e',
		ё: 'e',
		ж: 'zh',
		з: 'z',
		и: 'i',
		й: 'y',
		к: 'k',
		л: 'l',
		м: 'm',
		н: 'n',
		о: 'o',
		п: 'p',
		р: 'r',
		с: 's',
		т: 't',
		у: 'u',
		ф: 'f',
		х: 'kh',
		ц: 'ts',
		ч: 'ch',
		ш: 'sh',
		щ: 'sch',
		ъ: '',
		ы: 'y',
		ь: '',
		э: 'e',
		ю: 'yu',
		я: 'ya'
	};
	return str
		.split('')
		.map((ch) => map[ch] ?? ch)
		.join('');
}

function toCamel(str) {
	return transliterate(str)
		.replace(/[^A-Za-z0-9]+/g, ' ')
		.trim()
		.toLowerCase()
		.split(' ')
		.map((w, i) => (i ? w[0].toUpperCase() + w.slice(1) : w))
		.join('');
}

// --- 3. Примитивный CSV-парсер (supports ; and quoted fields) -----
function parseCsv(text, delimiter = ';') {
	const rows = [];
	let row = [],
		field = '',
		inQuotes = false;

	for (let i = 0; i < text.length; i++) {
		const ch = text[i];

		if (ch === '"') {
			if (inQuotes && text[i + 1] === '"') {
				field += '"';
				i++;
			} else {
				inQuotes = !inQuotes;
			}
		} else if (ch === delimiter && !inQuotes) {
			row.push(field);
			field = '';
		} else if ((ch === '\n' || ch === '\r') && !inQuotes) {
			if (ch === '\r' && text[i + 1] === '\n') i++; // CRLF
			row.push(field);
			rows.push(row);
			row = [];
			field = '';
		} else {
			field += ch;
		}
	}
	if (field !== '' || row.length) {
		row.push(field);
		rows.push(row);
	}
	return rows;
}

// --- 4. Main ------------------------------------------------------
async function main() {
	let csv = await fs.readFile('HR_Temp_csv.csv', 'utf8');
	if (csv.charCodeAt(0) === 0xfeff) csv = csv.slice(1); // BOM

	const [rawHeaders, ...dataRows] = parseCsv(csv);
	const keys = rawHeaders.map((h) => keyMap[h.trim()] ?? toCamel(h));

	const records = dataRows
		.filter((r) => r.some((cell) => cell.trim() !== '')) // skip empty
		.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? '').trim()])));

	const out =
		`// Auto-generated on ${new Date().toISOString()}\n` +
		`export const hr = ${JSON.stringify(records, null, 2)};\n`;

	await fs.writeFile('HR_TEMP.js', out, 'utf8');
	console.log(`✅ HR_TEMP.js создан. Объектов: ${records.length}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
