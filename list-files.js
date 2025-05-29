// list-files.js
// node list-files.js

const fs = require('fs').promises;
const path = require('path');

async function main() {
	/* путь к папке — поменяйте при необходимости */
	const dir = '/Users/aleksei.barysnikov/repos/theaters/static/theaters';

	/* читаем только обычные файлы (исключая подпапки) */
	const entries = await fs.readdir(dir, { withFileTypes: true });
	const files = entries
		.filter((ent) => ent.isFile())
		.map((ent) => ent.name) // хотим получить только имя
		.sort(); // по алфавиту, чтобы был стабильный порядок

	/* формируем строку в нужном формате */
	const result = `const files = ${JSON.stringify(files, null, 2)};`;

	console.log(result);
}

main().catch((err) => {
	console.error('Ошибка:', err);
	process.exit(1);
});
