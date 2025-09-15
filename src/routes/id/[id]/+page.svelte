<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { hr } from '$lib/hr';
	import { theaterSocials } from '$lib/theaterSocials';
	import { theaters } from '$lib/theaters-data';
	import { ticketOperator } from '$lib/ticketOperator';
	import { ranking } from '$lib/ranking';
	import { ArrowLeft } from 'lucide-svelte';
	import GanttChart from '$lib/GanttChart.svelte';
	import { theatersPremiers } from '$lib/theatersPremiers';
	import { theatersFinance } from '$lib/theatersFinance';
	import { theatersExpenses } from '$lib/theatersExpenses';
	import DynamicChart from '$lib/DynamicChart.svelte';
	import { theatersDynamic } from '$lib/theatersDynamic';
	import { theatersOffbudget } from '$lib/theatersOffbudget';
	import PersonPopup from '$lib/PersonPopup.svelte';
	import HorizontalBarChart from '$lib/HorizontalBarChart.svelte';
	import { theatersStaff } from '$lib/theatersStaff';
	import { theatersEventsRaw } from '$lib/theatersEventsRaw';
	import { type EndedMode } from '$lib/aggEvents';
	import { theatersSpacesExtra } from '$lib/theatersSpacesExtra';
	import {
		filterRows,
		aggregateByTitleHall,
		aggregateByMonth,
		type OtherTypeMode
	} from '$lib/aggEvents';

	/* --------- данные театра --------- */
	let theater: Theater = theaters[0];
	let personalOpen = true; // Скрываем / Открываем артистов
	let artistsOpen = true; // Скрываем / Открываем артистов
	let eventsWithPicturesOpen = false; // Скрываем / Открываем
	let BaseInfoOpen = false; // Скрываем / Открываем артистов
	let financeYear = 2024; // Выбранный год, стандартно оставляем 2024 год

	let onlyMainStage = true; // тумблер «только основная сцена»
	let otherMode: OtherTypeMode = 'exclude'; // режим для OtherEventType: 'exclude' | 'include' | 'only'
	// Режим группировки: по ГОДУ или по СЕЗОНУ
	let groupMode: 'year' | 'season' = 'year';
	let selectedSeason: number | null = null;
	let endedMode: EndedMode = 'all';

	// Список доступных сезонов для текущего театра
	$: availableSeasons = Array.from(
		new Set(
			theatersEventsRaw
				.filter((r) => r.theaterId === theater.id && r.season != null)
				.map((r: any) => Number(r.season))
				.filter((n) => Number.isFinite(n))
		)
	).sort((a, b) => b - a);
	// --- универсальный фоллбек для <img> ----------------------------------------
	function onImgError(e: Event, fallback: string) {
		const img = e.currentTarget as HTMLImageElement;
		if (img && img.src !== fallback) img.src = fallback;
	}

	// SVG → data URI
	const svgDataURI = (svg: string) => 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);

	// 🔶 плейсхолдер для СОТРУДНИКОВ (кружок-аватар)
	const staffFallback = svgDataURI(`
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
  <rect width="100%" height="100%" fill="#334155"/>
  <circle cx="64" cy="48" r="26" fill="#64748b"/>
  <rect x="26" y="82" width="76" height="34" rx="17" fill="#64748b"/>
</svg>`);

	// 🔷 плейсхолдер для ПЛОЩАДОК (иконка сцены)
	const spaceFallback = svgDataURI(`
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <rect width="100%" height="100%" fill="#1f2937"/>
  <rect x="80" y="220" width="480" height="40" rx="8" fill="#4b5563"/>
  <rect x="120" y="160" width="400" height="40" rx="8" fill="#6b7280"/>
  <rect x="160" y="120" width="320" height="30" rx="6" fill="#9ca3af"/>
</svg>`);
	// 🔶 плейсхолдер для ФОТОБАНКА (иконка камеры в кружке)
	const photobankFallback = svgDataURI(`
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#475569"/>
      <stop offset="1" stop-color="#334155"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <circle cx="64" cy="64" r="46" fill="#1f2937"/>
  <rect x="36" y="54" width="56" height="30" rx="6" fill="#64748b"/>
  <rect x="44" y="48" width="20" height="10" rx="3" fill="#94a3b8"/>
  <circle cx="64" cy="69" r="12" fill="#0ea5e9"/>
  <circle cx="64" cy="69" r="6" fill="#e2e8f0"/>
</svg>`);
	// Удобный геттер фото сотрудника: если пусто — сразу плейсхолдер
	const getStaffPhoto = (file?: string | null) => (file ? hrimg(file) : staffFallback);

	// Автовыбор сезона при переключении режима
	$: if (groupMode === 'season' && selectedSeason == null && availableSeasons.length) {
		selectedSeason = availableSeasons[0]; // последний (самый новый)
	}
	const setYear = (y: 2024 | 2025) => (financeYear = y);
	$: expenseData = (() => {
		const t = theatersExpenses.find((x) => x.id === theater.id);
		if (!t) return [];

		const yr = t.years.find((y) => y.year === financeYear);
		if (!yr) return [];

		const { total, breakdown } = yr;
		/* helper, чтобы превращать «доля» в percent (0 … 1) */
		const pct = (v: number) => (v ? v : 0);

		return [
			{
				label: 'Всего',
				percent: 1,
				value: `${formatRubAbbreviated(total)}`
			},
			{
				label: 'ФОТ',
				percent: pct(breakdown.fot.share),
				value: formatRubAbbreviated(breakdown.fot.value),
				avg: pct(breakdown.fot.avgShare),
				avgPct: pct(breakdown.fot.avgShare)
			},
			{
				label: 'ГПХ',
				percent: pct(breakdown.gph.share),
				value: formatRubAbbreviated(breakdown.gph.value),
				avg: pct(breakdown.gph.avgShare),
				avgPct: pct(breakdown.gph.avgShare)
			},
			{
				label: 'Авторские',
				percent: pct(breakdown.royalties.share),
				value: formatRubAbbreviated(breakdown.royalties.value),
				avg: pct(breakdown.royalties.avgShare),
				avgPct: pct(breakdown.royalties.avgShare)
			},
			{
				label: 'Транспорт',
				percent: pct(breakdown.transport.share),
				value: formatRubAbbreviated(breakdown.transport.value),
				avg: pct(breakdown.transport.avgShare),
				avgPct: pct(breakdown.transport.avgShare)
			},
			{
				label: 'Мероприятия',
				percent: pct(breakdown.events.share),
				value: formatRubAbbreviated(breakdown.events.value),
				avg: pct(breakdown.events.avgShare),
				avgPct: pct(breakdown.events.avgShare)
			},
			{
				label: 'Аренда',
				percent: pct(breakdown.rent.share),
				value: formatRubAbbreviated(breakdown.rent.value),
				avg: pct(breakdown.rent.avgShare),
				avgPct: pct(breakdown.rent.avgShare)
			}
			//мероприятия
		];
	})();

	// --- доп.инфа по площадкам (из theatersSpacesExtra) -----------------
	const norm = (x?: unknown) => (x ?? '').toString().trim().toLowerCase();

	type ExtraSpace = {
		spaceId?: number | null;
		venue_space_short_name?: string;
		address?: string;
		okrug?: string;
		district?: string;
		maps_link?: string;
		genre?: string;
		metro?: string;
		metro_walk_min?: number | null;
		has_cafe?: boolean | null;
		has_buffet?: boolean | null;
		has_souvenir_shop?: boolean | null;
	};

	$: spacesExtra = theatersSpacesExtra.find((t) => t.id === theater.id)?.spaces ?? [];

	$: extraById = new Map(
		spacesExtra.filter((e) => e.spaceId != null).map((e) => [String(e.spaceId), e])
	);

	// итоговый список площадок с подмешанными полями из extra
	$: spacesEnriched = theater.spaces.map((s: any) => {
		const sid = s.id ?? s.space_id ?? s.spaceId ?? null;

		// 1) пытаемся матчить по id
		let extra = sid != null ? extraById.get(String(sid)) : undefined;

		// 2) если нет — матчим по короткому названию сцены
		if (!extra) {
			extra = spacesExtra.find(
				(e) => norm(e.venue_space_short_name) === norm(s.venue_space_short_name)
			);
		}

		return {
			...s,
			// не затираем уже имеющееся — только дополняем
			genre: s.genre ?? extra?.genre,
			okrug: s.okrug ?? extra?.okrug,
			district: s.district ?? extra?.district,
			address: s.address ?? extra?.address,
			maps_link: s.maps_link ?? extra?.maps_link,
			metro: s.metro ?? extra?.metro,
			metro_walk_min: s.metro_walk_min ?? extra?.metro_walk_min,
			has_cafe: s.has_cafe ?? extra?.has_cafe,
			has_buffet: s.has_buffet ?? extra?.has_buffet,
			has_souvenir_shop: s.has_souvenir_shop ?? extra?.has_souvenir_shop
		};
	});
	// Палитра как в прежней верстке (опционально)
	const obPalette = {
		total: '#f03066',
		tickets: '#60a5fa',
		touring: '#10b981',
		property: '#f59e0b',
		advertising: '#a78bfa'
	};

	$: offbudgetData = (() => {
		const t = theatersOffbudget.find((x) => x.id === theater.id);
		if (!t) return [];

		const yr = t.years.find((y) => y.year === financeYear);
		if (!yr) return [];

		const { total, breakdown } = yr;
		const pct = (v: number | undefined) => v ?? 0;

		return [
			{
				label: 'Всего',
				percent: 1,
				value: `${formatRubAbbreviated(total)}`,
				color: obPalette.total
			},
			{
				label: 'Билеты',
				percent: pct(breakdown.tickets.share),
				value: formatRubAbbreviated(breakdown.tickets.value),
				avg: pct(breakdown.tickets.avgShare),
				avgPct: pct(breakdown.tickets.avgShare),
				color: obPalette.tickets
			},
			{
				label: 'Гастроли',
				percent: pct(breakdown.touring.share),
				value: formatRubAbbreviated(breakdown.touring.value),
				avg: pct(breakdown.touring.avgShare),
				avgPct: pct(breakdown.touring.avgShare),
				color: obPalette.touring
			},
			{
				label: 'Собственность',
				percent: pct(breakdown.property.share),
				value: formatRubAbbreviated(breakdown.property.value),
				avg: pct(breakdown.property.avgShare),
				avgPct: pct(breakdown.property.avgShare),
				color: obPalette.property
			},
			{
				label: 'Реклама',
				percent: pct(breakdown.advertising.share),
				value: formatRubAbbreviated(breakdown.advertising.value),
				avg: pct(breakdown.advertising.avgShare),
				avgPct: pct(breakdown.advertising.avgShare),
				color: obPalette.advertising
			}
		];
	})();

	$: theater = theaters.find((t) => t.id === Number($page.params.id)) || theater;

	/* --------- helpers --------- */
	const theaterimg = (file: string) => `${base}/theaters/${file}_1.jpg`;
	const spaceimg = (file: string) => `${base}/spaces/${file}.jpg`;
	const productionimg = (file: string) => `${base}/productions/${file}.jpg`;
	const hrimg = (file: string) => `${base}/hr/${file}`;
	const socialsimg = (file: string) => `${base}/socials/${file}`;
	$: totalSeats = theater.spaces.reduce((s, v) => s + (v.total_capacity ?? 0), 0);
	$: premieres = theatersPremiers.find((t) => t.id === theater.id)?.premiers ?? [];
	$: finances = theatersFinance.find((t) => t.id === theater.id)?.year ?? [];

	$: dynamics = theatersDynamic.find((t) => t.id === theater.id)?.dynamic ?? [];

	function titleCase(str: unknown, fallback = '—') {
		const s = (str ?? '').toString().trim();
		if (!s) return fallback;
		// \p{L}+ — последовательность букв (Unicode)
		return s.replace(/\p{L}+/gu, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
	}

	function joinTitleCase(parts: unknown[], sep = ' / ', fallback = '—') {
		const items = parts
			.map((v) => titleCase(v, '')) // твой безопасный titleCase из прошлого сообщения
			.filter(Boolean);
		return items.length ? items.join(sep) : fallback;
	}

	function trimTitles(titles?: unknown, max = 60) {
		const s = (titles ?? '').toString();
		return s.length > max ? s.slice(0, max - 3) + '…' : s;
	}

	function formatPhone(raw?: string | null) {
		if (!raw) return ''; // ничего не показываем, если телефона нет
		let d = raw.replace(/\D+/g, '');
		if (d.length === 11) {
			if (d[0] === '8') d = '7' + d.slice(1);
			const m = d.match(/^(\d)(\d{3})(\d{3})(\d{2})(\d{2})$/);
			if (m) {
				const [, c, a, b, c2, d2] = m;
				return `+${c}-${a}-${b}-${c2}-${d2}`;
			}
		}
		return raw.trim();
	}

	// показываем только если это конечное положительное число
	const hasStat = (n?: number | null) => typeof n === 'number' && Number.isFinite(n) && n > 0;

	$: staffCards = [
		{ label: 'СОТРУДНИКИ', value: staffTotal },
		{ label: 'АДМИНИСТРАТИВНЫЙ ПЕРСОНАЛ', value: staffAdmin },
		{ label: 'ХУДОЖЕСТВЕННЫЙ ПЕРСОНАЛ', value: staffArtistic },
		{ label: 'АРТИСТЫ', value: staffArtists }
	].filter((c) => hasStat(c.value));

	// чтобы не рисовать битую ссылку если пусто/пробелы
	const safeHref = (url?: string | null) => (url && url.trim() ? url : null);

	function formatRubAbbreviated(number: number) {
		const abs = Math.abs(number);
		let suffix = '';
		let divisor = 1;

		if (abs >= 1e9) {
			suffix = ' млрд'; // миллиард
			divisor = 1e9;
		} else if (abs >= 1e6) {
			suffix = ' млн'; // миллион
			divisor = 1e6;
		} else if (abs >= 1e3) {
			suffix = ' тыс'; // тысяча
			divisor = 1e3;
		}

		const shortNumber = number / divisor;

		const formatted = new Intl.NumberFormat('ru-RU', {
			maximumFractionDigits: 1
		}).format(shortNumber);

		return `${formatted}${suffix}`;
	}
	/* раскрытие площадок */
	let expanded = -1; // индекс раскрытой площадки

	const goToMain = () => {
		window.location.href = '/';
	};
	function showPersonBio(p) {
		selectedPerson.name = p.fullName;
		selectedPerson.position = p.position;
		selectedPerson.photo = getStaffPhoto(p.photo); // <-- тут
		selectedPerson.biography = p.biography;
		showPopup = true;
	}

	let showPopup = false;
	let selectedPerson = {
		name: 'Жуков Владимир Иванович',
		position: 'Директор',
		photo: 'path/to/photo.jpg',
		biography: 'Биография ...'
	};
	// 🔁 ТОП мероприятий (сначала пытаемся из сырых, иначе — из старого агрегата theatersEvents)
	// 🔎 единый отфильтрованный массив «сырых» показов под текущие фильтры
	// Единая выборка с учётом всех фильтров
	$: filteredRaw = filterRows(theatersEventsRaw as any, {
		theaterId: theater.id,
		year: groupMode === 'year' ? financeYear : undefined,
		season:
			groupMode === 'season'
				? selectedSeason == null
					? undefined
					: Number(selectedSeason)
				: undefined,
		mainStage: onlyMainStage ? true : undefined,
		otherTypeMode: otherMode,
		endedMode
	});
	// Таблица «Спектакли ...»: агрегация по (Название + Сцена)
	$: eventSales = aggregateByTitleHall(filteredRaw);

	// Пригодится для графиков динамики
	$: eventsByMonth = aggregateByMonth(filteredRaw);

	/* ===== Соседний (предыдущий) период ===== */

	// предыдущий сезон из списка (availableSeasons отсортирован по убыванию)
	$: prevSeason = (() => {
		if (groupMode !== 'season' || selectedSeason == null) return null;
		const idx = availableSeasons.indexOf(Number(selectedSeason));
		// следующий элемент в убывающем списке = предыдущий по времени
		return idx !== -1 && idx < availableSeasons.length - 1
			? availableSeasons[idx + 1]
			: availableSeasons.includes(Number(selectedSeason) - 1)
				? Number(selectedSeason) - 1
				: null;
	})();

	// предыдущий год
	$: prevYear = groupMode === 'year' ? financeYear - 1 : null;

	// Выборка предыдущего периода с теми же фильтрами
	$: prevFilteredRaw = filterRows(theatersEventsRaw as any, {
		theaterId: theater.id,
		year: groupMode === 'year' ? (prevYear ?? undefined) : undefined,
		season: groupMode === 'season' ? (prevSeason ?? undefined) : undefined,
		mainStage: onlyMainStage ? true : undefined,
		otherTypeMode: otherMode,
		endedMode
	});

	// Агрегат прошлого периода
	$: prevEventSales = aggregateByTitleHall(prevFilteredRaw);

	// Быстрый поиск «прошлой» строки по ключу (название+сцена)
	function keyOf(e: { title: string; hall: string }) {
		return `${e.title}__${e.hall}`;
	}
	$: prevMap = new Map(prevEventSales.map((e) => [keyOf(e), e]));

	/* ===== Дельты для показа рядом со значениями ===== */
	function pctDelta(cur?: number, prev?: number | null) {
		return typeof cur === 'number' && typeof prev === 'number' && isFinite(prev) && prev !== 0
			? (cur - prev) / prev
			: null; // нет данных/деление на 0 — не показываем
	}
	function ppDelta(cur?: number, prev?: number | null) {
		return typeof cur === 'number' && typeof prev === 'number' ? (cur - prev) * 100 : null;
	}
	function fmtDeltaPct(x: number | null, digits = 0) {
		if (x === null) return '';
		const v = x * 100;
		const s = v > 0 ? '+' : '';
		return `${s}${v.toFixed(digits)}%`;
	}
	function fmtDeltaPP(x: number | null, digits = 1) {
		if (x === null) return '';
		const s = x > 0 ? '+' : '';
		return `${s}${x.toFixed(digits)} п.п.`;
	}
	function deltaClass(x: number | null) {
		return x === null
			? 'text-slate-400/60'
			: x > 0
				? 'text-emerald-400'
				: x < 0
					? 'text-rose-400'
					: 'text-slate-400';
	}

	// Таблица с дельтами
	$: rowsWithDelta = eventSales.map((e) => {
		const p = prevMap.get(keyOf(e));

		const avgPrice = e.tickets > 0 ? e.sales / e.tickets : 0;
		const prevAvgPrice = p && p.tickets > 0 ? p.sales / p.tickets : null;

		return {
			...e,
			avgPrice,
			_delta: {
				sales: pctDelta(e.sales, p?.sales),
				perShow: pctDelta(e.salesPerShow, p?.salesPerShow),
				tickets: pctDelta(e.tickets, p?.tickets),
				seances: pctDelta(e.seances, p?.seances),
				occupancyPP: ppDelta(e.occupancy, p?.occupancy), // изменение в п.п.
				sharePP: ppDelta(e.share, p?.share), // изменение в п.п.              // п.п.
				avgPrice: pctDelta(avgPrice, prevAvgPrice)
			}
		};
	});

	/** форматируем числовое значение ₽ с пробелами-тысячниками */
	const fmtRub = (n: number) => new Intl.NumberFormat('ru-RU').format(n);

	// Найдём строку со штатами для текущего театра (id = ИНН)
	$: staffRow = theatersStaff.find((x) => x.id === theater.id) ?? null;
	$: staffMeta = staffRow?.meta ?? null;
	$: staff = staffRow?.staff ?? null;

	// Удобный форматтер целых чисел (пробелы-тысячники)
	const fmtInt = (n?: number | null) =>
		n == null ? '—' : new Intl.NumberFormat('ru-RU').format(Math.round(n));

	// Фоллбэк к полям старой структуры, если в новом файле чего-то нет
	$: staffTotal = staff?.total ?? theater.employees ?? null;
	$: staffArtistic = staff?.artistic ?? theater.artistic_staff ?? null;
	$: staffArtists = staff?.artists ?? theater.cast ?? null;
	$: staffAdmin = staff?.admin ?? null;
	$: staffOther = staff?.other ?? null;

	//Детализация по спектаклям:
	// === ВЛОЖЕННОСТЬ ДЛЯ ТАБЛИЦЫ «СПЕКТАКЛИ» ===
	let expandedDetail = new Set<string>(); // раскрытые строки 1-го уровня (мероприятия)

	// Стабильный ключ мероприятия (Название + Сцена)
	function detailKey(e: { title: string; hall: string }) {
		return `${e.title}__${e.hall}`;
	}
	function toggleDetail(key: string) {
		const next = new Set(expandedDetail);
		if (next.has(key)) next.delete(key);
		else next.add(key);
		expandedDetail = next;
	}

	// При смене фильтров сбрасываем раскрытия
	$: {
		groupMode;
		financeYear;
		selectedSeason;
		onlyMainStage;
		otherMode;
		endedMode;
		expandedDetail = new Set();
	}

	// Формат процента 0..1 → "##.#%"
	function fmtPercent01(x?: number | null, digits = 0) {
		if (x == null) return '—';
		return `${(x * 100).toFixed(digits)}%`;
	}

	// Универсальные парсеры даты/времени (как в рейтинге)
	function _pick(obj: any, keys: string[]) {
		return keys.find((k) => obj[k] != null) ? obj[keys.find((k) => obj[k] != null)!] : undefined;
	}
	function _parseMaybeDate(input: any): Date | null {
		if (input == null) return null;
		if (input instanceof Date) return input;
		if (typeof input === 'number') return new Date(input);
		if (typeof input === 'string') {
			const d1 = new Date(input);
			if (!Number.isNaN(+d1)) return d1;

			const m = input.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})(?:[ T](\d{1,2}):(\d{2}))?$/);
			if (m) {
				const [, dd, mm, yyyy, hh, mi] = m;
				const year = (yyyy.length === 2 ? 2000 + Number(yyyy) : Number(yyyy)) || 0;
				const date = new Date(
					year,
					Number(mm) - 1,
					Number(dd),
					hh ? Number(hh) : 0,
					mi ? Number(mi) : 0
				);
				if (!Number.isNaN(+date)) return date;
			}
		}
		return null;
	}
	function _dateFromRow(r: any): Date | null {
		let dtLike =
			_pick(r, [
				'datetime',
				'dateTime',
				'date_time',
				'dt',
				'start',
				'startAt',
				'start_at',
				'startDateTime',
				'start_datetime',
				'when'
			]) ?? r.date;

		let timeLike = _pick(r, [
			'time',
			'startTime',
			'start_time',
			'showTime',
			'performanceTime',
			'sessionTime'
		]);

		let d = _parseMaybeDate(dtLike);
		if (d) return d;

		if (r.date && timeLike) {
			const base = _parseMaybeDate(r.date);
			if (base) {
				const [h, m] = String(timeLike).split(':').map(Number);
				if (!Number.isNaN(h)) base.setHours(h, Number.isNaN(m) ? 0 : m);
				return base;
			}
		}
		const ts = _pick(r, ['ts', 'timestamp']);
		return _parseMaybeDate(ts);
	}
	const fmtDate = (d: Date | null, fallback?: string) =>
		d ? d.toLocaleDateString('ru-RU') : (fallback ?? '—');
	const fmtTime = (d: Date | null, fallback?: string) =>
		d ? d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : (fallback ?? '—');

	// Сеансы для конкретной строки (Название+Сцена) с учётом текущих фильтров
	function sessionsForEvent(e: { title: string; hall: string }) {
		// Берём уже отфильтрованные "сырые" ряды под текущие фильтры
		const same = (filteredRaw as any[]).filter((r) => r.title === e.title && r.hall === e.hall);

		// Сумма продаж театра в текущем срезе — для расчёта доли
		const theaterTotal = (eventSales as any[]).reduce((s, v) => s + (v.sales ?? 0), 0);

		return (
			same
				.map((r: any) => {
					const sales = r.sales ?? 0;
					const tickets = r.tickets ?? 0;
					const avgPrice = tickets > 0 ? sales / tickets : 0;

					const dt = _dateFromRow(r);
					const dateStr = dt ? fmtDate(dt) : (r.date ?? '—');
					const timeStr = dt ? fmtTime(dt) : (r.time ?? r.startTime ?? '—');

					const capacity = r.capacity ?? r.totalCapacity ?? r.seats ?? null;
					const occupancy =
						typeof r.occupancy === 'number'
							? r.occupancy
							: capacity
								? (tickets ?? 0) / capacity
								: null;

					const share = theaterTotal > 0 ? sales / theaterTotal : 0;

					return {
						...r,
						sales,
						tickets,
						avgPrice,
						occupancy,
						share,
						_dt: dt,
						_dateStr: dateStr,
						_timeStr: timeStr
					};
				})
				// Сортировка: свежие сверху (можешь поменять на по выручке)
				.sort((a: any, b: any) => (+b._dt || 0) - (+a._dt || 0))
		);
	}

	// === СОРТИРОВКА ДЛЯ ТАБЛИЦЫ «СПЕКТАКЛИ» ===
	type SortKey =
		| 'sales'
		| 'salesPerShow'
		| 'tickets'
		| 'avgPrice'
		| 'seances'
		| 'occupancy'
		| 'share';

	let sortBy: SortKey = 'sales';
	let sortDir: 'desc' | 'asc' = 'desc';

	const thBtnClass = (k: SortKey) =>
		`flex items-center gap-1 hover:underline ${sortBy === k ? 'text-blue-400' : ''}`;

	function setSort(k: SortKey) {
		if (sortBy === k) sortDir = sortDir === 'desc' ? 'asc' : 'desc';
		else {
			sortBy = k;
			sortDir = 'desc';
		}
	}

	// вспомогательно: null/undefined уводим «в конец»
	function valueForSort(row: any, key: SortKey) {
		const v = row[key];
		if (v == null || Number.isNaN(v)) return -Infinity; // чтобы пустые были в конце при desc
		return v;
	}

	// Отсортированный список для отображения
	$: rowsSorted = [...rowsWithDelta].sort((a, b) => {
		const va = valueForSort(a, sortBy);
		const vb = valueForSort(b, sortBy);
		if (va === vb) return 0;
		const mul = sortDir === 'desc' ? -1 : 1;
		return va > vb ? mul : -mul;
	});
</script>

<!-- переключатель года -->

<div class="flex min-h-screen w-full flex-col items-center">
	<!-- header -->
	<div class="w-full bg-slate-900 text-white">
		<header class="mx-auto w-full max-w-6xl p-6 pt-25">
			<div class="flex flex-col justify-between lg:flex-row">
				<!-- left -->
				<div class="flex-1">
					<!-- Социальные сети театра -->
					<h1 class="mb-4 text-4xl font-bold">{theater.name}</h1>
					<div class="mb-2 flex flex-col">
						{#each ticketOperator.filter((s) => s.id == theater.id) as s}
							<div class="flex flex-wrap gap-4 whitespace-nowrap">
								{#each s.operators as operators}
									<div class="rounded-sm bg-slate-700 px-3">{operators.name}</div>
								{/each}
							</div>
						{/each}
					</div>

					<!-- hr -->
					<div class="mt-4 mb-8 line-clamp-4 opacity-[0.7]">{theater.description}</div>

					<p class="mb-2 text-gray-400">{theater.address}</p>
					<div class="flex flex-wrap items-center justify-between">
						<div>
							{#each theaterSocials.filter((s) => s.id == theater.id) as s}
								<div class="top-16 my-4 flex gap-4">
									{#each s.socials as social}
										<a target="_blank" href={social.link}
											><img class="size-6" src={socialsimg(social.photo)} alt="" />
										</a>
									{/each}
								</div>
							{/each}
						</div>
						<div>
							<div class="rounded-full border-2 px-3 text-slate-700">
								{theater.reconstruction}
							</div>
						</div>
					</div>
				</div>

				<!-- right -->
				<div class="mt-8 w-full lg:mt-0 lg:ml-8 lg:w-80">
					<div class="mb-4 rounded-lg bg-slate-800 p-4">
						{#if ranking.find((r) => r.id === theater.id)}
							{@const rank = ranking.find((r) => r.id === theater.id)}
							<div class="font-bold text-[#f03066]">
								#{rank.rankRevenue2025}
								<span class="text-gray-300">по выручке </span>
							</div>
							<div class="font-bold text-[#f03066]">
								#{rank.rankTickets2025}
								<span class="text-gray-300">по посещаемости</span>
							</div>
							<div class="mb-2"></div>
						{/if}
					</div>

					<!-- фото -->
					<div class="mb-4 overflow-hidden rounded-lg bg-slate-800">
						<img class="h-48 w-full object-cover" src={theaterimg(theater.id)} alt={theater.name} />
					</div>

					<div
						class="transition-color flex w-full items-center justify-between rounded bg-slate-700 px-4 py-3 text-left"
					>
						<div class="inline-block rounded bg-[#f03066] px-2 py-1 text-sm font-bold text-white">
							★ {theater.yandex_rating}
						</div>
						<p>Отзывы: {theater.yandex_reviews_count}</p>
						<p>Оценки: {theater.yandex_ratings_count}</p>
					</div>
				</div>
			</div>
			<!-- ▼ кнопка сворачивания / разворачивания базовой инфы -->
			<button
				class="mt-10 mb-4 flex items-center gap-2 text-xl font-semibold"
				onclick={() => (BaseInfoOpen = !BaseInfoOpen)}
			>
				Сотрудники
				<svg
					class="h-5 w-5 transition-transform duration-200 {BaseInfoOpen ? 'rotate-180' : ''}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>
			{#if BaseInfoOpen}
				{#if staffCards.length}
					<div class="flex flex-wrap justify-between gap-6">
						{#each staffCards as c}
							<h3 class="mt-8 mb-3 flex flex-col-reverse text-lg font-semibold">
								<div class="text-xs tracking-wide text-gray-400 uppercase">{c.label}</div>
								<div class="text-4xl leading-none sm:text-5xl md:text-6xl lg:text-7xl">
									{fmtInt(c.value)}
								</div>
							</h3>
						{/each}
					</div>
				{/if}

				<h3 class="mt-10 mb-4 text-xl font-semibold">РУКОВОДСТВО</h3>
				<div class="grid gap-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
					{#each hr.filter((h) => h.organizationInn == theater.id && (h.position.toLowerCase() == 'директор' || h.position
									.toLowerCase()
									.startsWith('художественный руководитель') || h.position
									.toLowerCase()
									.startsWith('художественный') || h.position
									.toLowerCase()
									.startsWith('генеральный директор'))) as p}
						<div class="relative h-30">
							<div class="flex items-start space-x-3">
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
								<img
									class="size-16 cursor-pointer rounded-full"
									src={getStaffPhoto(p.photo)}
									alt=""
									onclick={() => showPersonBio(p)}
									onerror={(e) => onImgError(e, staffFallback)}
								/>

								<div>
									<div class="font-semibold">{titleCase(p.fullName, '—')}</div>
									<div class="text-sm text-gray-400">{titleCase(p.position, '—')}</div>
									<div class="text-sm text-gray-400">{formatPhone(trimTitles(p.phone))}</div>
								</div>
							</div>
							<div class="absolute top-16 flex gap-4">
								{#if p.wikiUrl}
									<a target="_blank" href={p.wikiUrl}
										><img class="size-6" src={socialsimg('wiki.jpg')} alt="" />
									</a>
								{/if}
								{#if p.linkToTheaterSite}
									<a target="_blank" href={p.linkToTheaterSite}
										><img class="size-6" src={socialsimg(theater.id + '_logo.jpg')} alt="" />
									</a>
								{/if}
							</div>
						</div>
					{/each}
				</div>

				<!-- пресс-служба -->
				<h3 class="mt-10 mb-4 text-xl font-semibold">ПРЕСС-СЛУЖБА</h3>
				<div class="grid gap-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
					{#each hr.filter((h) => h.organizationInn == theater.id && h.position.toLowerCase() == 'пресс-служба') as p}
						<div class="relative h-30">
							<div class="flex items-start space-x-3">
								<!-- <img class="size-16 rounded-full" src={hrimg(p.photo)} alt="" /> -->
								<div>
									<div class="font-semibold">{titleCase(p.fullName)}</div>
									<div class="text-sm text-gray-400">{titleCase(p.position)}</div>
									<div class="text-sm text-gray-400">{formatPhone(trimTitles(p.phone))}</div>
									<div class="text-sm text-gray-400">{trimTitles(p.email)}</div>
								</div>
							</div>
							<div class="absolute top-16 flex gap-4"></div>
						</div>
					{/each}

					<div class="relative h-30">
						<div class="flex items-start space-x-3">
							{#if safeHref(theater.fotobankLink)}
								<a target="_blank" class="flex flex-col gap-2" href={theater.fotobankLink}>
									<img
										class="size-16 rounded-full"
										src={socialsimg(theater.id + '_logo.jpg')}
										alt="Фотобанк"
										onerror={(e) => onImgError(e, photobankFallback)}
									/>
									<div>
										<div class="text-sm text-gray-400">Фотобанк</div>
									</div>
								</a>
							{:else}
								<!-- если ссылки нет — показываем плейсхолдер и «глушим» клики -->
								<div
									class="flex cursor-not-allowed flex-col gap-2 opacity-70"
									title="Ссылка на фотобанк не указана"
								>
									<img
										class="size-16 rounded-full"
										src={photobankFallback}
										alt="Фотобанк"
										onerror={(e) => onImgError(e, photobankFallback)}
									/>
									<div>
										<div class="text-sm text-gray-400">Фотобанк</div>
									</div>
								</div>
							{/if}
						</div>
						<div class="absolute top-16 flex gap-4"></div>
					</div>
				</div>

				<!-- АРТИСТЫ -->
				<button
					class="mt-10 mb-4 flex items-center gap-2 text-xl font-semibold"
					onclick={() => (artistsOpen = !artistsOpen)}
				>
					АРТИСТЫ
					<svg
						class="h-5 w-5 transition-transform duration-200 {artistsOpen ? 'rotate-180' : ''}"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</button>
				{#if artistsOpen}
					<div class="grid gap-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
						{#each hr.filter((h) => h.organizationInn == theater.id && h.position.toLowerCase() == 'топовые артисты') as p}
							<div class="relative h-30">
								<div class="flex items-start space-x-3">
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
									<img
										class="size-16 cursor-pointer rounded-full"
										src={getStaffPhoto(p.photo)}
										alt=""
										onclick={() => showPersonBio(p)}
										onerror={(e) => onImgError(e, staffFallback)}
									/>

									<div>
										<div class="font-semibold">{p.fullName}</div>
										<div class="line-clamp-3 text-sm text-gray-400">{p.titles}</div>
									</div>
								</div>
								<div class="absolute top-16 flex gap-4">
									{#if p.wikiUrl}
										<a target="_blank" href={p.wikiUrl}
											><img class="size-6" src={socialsimg('wiki.jpg')} alt="" />
										</a>
									{/if}
									{#if p.linkToTheaterSite}
										<a target="_blank" href={p.linkToTheaterSite}
											><img class="size-6" src={socialsimg(theater.id + '_logo.jpg')} alt="" />
										</a>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			{/if}
		</header>
	</div>

	<!-- контент -->
	<div class="w-full bg-slate-900 text-white">
		<section class="mx-auto w-full max-w-6xl p-6">
			<h2 class="mb-6 text-2xl font-bold">{theater.spaces.length} площадки / {totalSeats} мест</h2>

			{#each spacesEnriched as s, i}
				<div class="mb-6 rounded-lg bg-slate-700">
					<button
						class="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-600"
						onclick={() => (expanded = expanded === i ? -1 : i)}
					>
						<span class="text-xl font-semibold"
							>{s.venue_space_short_name} / {s.total_capacity} мест</span
						>
						<svg
							class="h-6 w-6 transition-transform duration-300 {expanded === i ? 'rotate-180' : ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>

					{#if expanded === i}
						<div class="bg-slate-750 p-6">
							<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
								<!-- info -->
								<div>
									<p class="mb-4">
										<span class="text-sm text-gray-400">Тип:</span>
										<span class="">{s.type}</span>
									</p>

									<p class="mb-4">
										<span class="text-sm text-gray-400">Жанр:</span>
										<span>{titleCase(s.genre, '—')}</span>
									</p>

									<p class="mb-4">
										<span class="text-sm text-gray-400">Округ / район:</span>
										{joinTitleCase([s.okrug, s.district])}
									</p>

									<p class="mb-4">
										<span class="text-sm text-gray-400">Адресс:</span>
										<span>{titleCase(s.address, '—')}</span>
									</p>
									{#if s.metro}
										<p class="mb-4">
											<span class="text-sm text-gray-400">Метро:</span>
											<span>
												{s.metro}
												{#if s.metro_walk_min != null}
													· {s.metro_walk_min} мин пешком{/if}
											</span>
										</p>
									{/if}

									<!-- бейджики-удобства -->
									<div class="mt-2 flex flex-wrap gap-2">
										{#if s.has_cafe === true}
											<span class="rounded bg-slate-600 px-2 py-0.5 text-xs">Кафе</span>
										{/if}
										{#if s.has_buffet === true}
											<span class="rounded bg-slate-600 px-2 py-0.5 text-xs">Буфет</span>
										{/if}
										{#if s.has_souvenir_shop === true}
											<span class="rounded bg-slate-600 px-2 py-0.5 text-xs">Сувениры</span>
										{/if}
									</div>
									{#if safeHref(s.maps_link)}
										<a
											class="mb-6 inline-block text-blue-400 underline"
											href={s.maps_link}
											target="_blank"
											rel="noopener">Открыть в&nbsp;Яндекс.Картах</a
										>
									{/if}
								</div>

								<!-- фото площадки -->
								<div
									class="flex h-40 items-center justify-center overflow-hidden rounded bg-slate-600"
								>
									<img
										class="h-full w-full object-cover"
										src={s.photo ? spaceimg(s.photo) : spaceFallback}
										alt={s.venue_space_short_name}
										onerror={(e) => onImgError(e, spaceFallback)}
									/>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</section>
		<section class="mx-auto w-full max-w-6xl p-6">
			<h2 class="mb-8 text-3xl font-bold">КАЛЕНДАРЬ ПРЕМЬЕР</h2>
			<GanttChart items={premieres} />
			<section class="mx-auto w-full max-w-6xl p-6">
				<h2 class="mb-8 text-3xl font-bold">Общая информация</h2>
			</section>
			<div class="mb-6 flex gap-3"></div>

			<!-- NEED TO ADD FUNCTION CONVERT BUDGET TO MLN -->
			<section class="mx-auto w-full max-w-6xl">
				<!-- //TODO: FIX DATA 
				<div class=" mx-auto flex max-w-6xl flex-wrap justify-between p-6 whitespace-nowrap">
					<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
						<div class="text-gray-400">expenseData МЛН, 2024</div>
						<div class="text-6xl">{finances.find((f) => f.year == financeYear)?.offBudget}</div>
					</h3>
					<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
						<div class="text-gray-400">Бюджет МЛН, 2024</div>
						<div class="text-6xl">{finances.find((f) => f.year == financeYear)?.budget}</div>
					</h3>
					<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
						<div class="text-gray-400">Бюджетная зависимость, 2024</div>
						<div class="text-6xl">{finances.find((f) => f.year == financeYear)?.dependence}</div>
					</h3>
				</div> -->
				<h2 class="mb-8 text-3xl font-bold">Внебюджет — {financeYear}</h2>
				<HorizontalBarChart items={offbudgetData} />

				<h2 class="mb-8 text-3xl font-bold">Расходы</h2>
				<HorizontalBarChart items={expenseData} />

				<div class=" mx-auto flex max-w-6xl flex-wrap justify-between p-6 whitespace-nowrap"></div>
			</section>

			<!-- <section class="mx-auto w-full max-w-6xl p-6">
				<DynamicChart data={dynamics} />
			</section> -->
			<h2 class="mb-8 text-3xl font-bold">Данные по спектаклям</h2>

			<!-- Переключатели фильтров по «сырым» данным -->
			<div class="mt-4 mb-6 flex flex-wrap items-center gap-4">
				<!-- Режим группировки -->
				<label class="flex items-center gap-2">
					<span class="text-gray-400">Группировка:</span>
					<select bind:value={groupMode} class="rounded bg-slate-700 px-2 py-1">
						<option value="year">по году</option>
						<option value="season">по сезону</option>
					</select>
				</label>

				{#if groupMode === 'year'}
					<!-- Как и раньше: кнопки 2024/2025 -->
					<button
						class="rounded-md px-3 py-1 text-sm font-semibold hover:bg-slate-700
        {financeYear === 2024 ? 'bg-slate-800 text-white' : 'bg-slate-600 text-gray-300'}"
						onclick={() => setYear(2024)}>2024</button
					>
					<button
						class="rounded-md px-3 py-1 text-sm font-semibold hover:bg-slate-700
        {financeYear === 2025 ? 'bg-slate-800 text-white' : 'bg-slate-600 text-gray-300'}"
						onclick={() => setYear(2025)}>2025</button
					>
				{:else}
					<!-- Выбор сезона -->
					<label class="flex items-center gap-2">
						<span class="text-gray-400">Сезон:</span>
						<select
							bind:value={selectedSeason}
							class="rounded bg-slate-700 px-2 py-1"
							onchange={(e) =>
								(selectedSeason = Number((e.currentTarget as HTMLSelectElement).value))}
						>
							{#each availableSeasons as s}
								<option value={s}>{s}</option>
							{/each}
						</select>
					</label>
				{/if}

				<!-- Фильтры сцены и «прочих» -->
				<label class="ml-4 flex items-center gap-2">
					<input type="checkbox" bind:checked={onlyMainStage} />
					Только основная сцена
				</label>
				<label class="flex items-center gap-2">
					<span class="text-gray-400">Статус:</span>
					<select bind:value={endedMode} class="rounded bg-slate-700 px-2 py-1">
						<option value="all">все</option>
						<option value="active">текущие</option>
						<option value="ended">завершённые</option>
					</select>
				</label>
				<label class="flex items-center gap-2">
					<span class="text-gray-400">Прочие события:</span>
					<select bind:value={otherMode} class="rounded bg-slate-700 px-2 py-1">
						<option value="exclude">исключить</option>
						<option value="include">включить</option>
						<option value="only">только «прочие»</option>
					</select>
				</label>
			</div>
			{#if ranking.find((r) => r.id === theater.id)}
				{@const rank = ranking.find((r) => r.id === theater.id)}

				<!-- <div class=" mx-auto flex max-w-6xl flex-wrap justify-between p-6 whitespace-nowrap">
					<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
						<div class="text-gray-400">Спектаклей,2024</div>
						<div class="text-6xl">49</div>
					</h3>
					<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
						<div class="text-gray-400">Показов, 2024</div>
						<div class="text-6xl">473</div>
					</h3>
					<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
						<div class="text-gray-400">Билетов, 2024</div>
						<div class="text-6xl">186 тыс.</div>
					</h3>
					<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
						<div class="text-gray-400">Заполняемость (физ)</div>
						<div class="text-6xl">54,7%</div>
					</h3>
				</div> -->
			{/if}
			<h2 class="mb-8 text-3xl font-bold">Спектакли</h2>
			<!-- 2024 -->

			<!-- обёртка со скроллом на узких экранах -->
			<!-- горизонтальный скролл + таблица с минимальной шириной -->
			<div class="-mx-6 md:mx-0">
				<div class="overflow-x-auto overscroll-x-contain">
					<table class="w-full min-w-[80rem] text-left">
						<thead class="border-b border-slate-700 text-gray-400">
							<tr>
								<th class="py-2 pr-3 text-right">№</th>

								<th class="py-2 pr-4">
									<!-- «Название» обычно не сортируем — можно оставить текстом;
				     но если нужно — сделай button и добавь ключ 'title' -->
									Название
								</th>

								<th class="py-2 pr-4">Сцена</th>

								<th class="py-2 pr-4">
									<button class={thBtnClass('sales')} onclick={() => setSort('sales')}>
										Продажи
										{#if sortBy === 'sales'}
											<svg
												class="h-3 w-3 transition-transform {sortDir === 'desc'
													? ''
													: 'rotate-180'}"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										{/if}
									</button>
								</th>

								<th class="py-2 pr-4">
									<button
										class={thBtnClass('salesPerShow')}
										onclick={() => setSort('salesPerShow')}
									>
										на 1 показ
										{#if sortBy === 'salesPerShow'}
											<svg
												class="h-3 w-3 transition-transform {sortDir === 'desc'
													? ''
													: 'rotate-180'}"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										{/if}
									</button>
								</th>

								<th class="py-2 pr-4">
									<button class={thBtnClass('tickets')} onclick={() => setSort('tickets')}>
										Билетов
										{#if sortBy === 'tickets'}
											<svg
												class="h-3 w-3 transition-transform {sortDir === 'desc'
													? ''
													: 'rotate-180'}"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										{/if}
									</button>
								</th>

								<th class="py-2 pr-4">
									<button class={thBtnClass('avgPrice')} onclick={() => setSort('avgPrice')}>
										Цена
										{#if sortBy === 'avgPrice'}
											<svg
												class="h-3 w-3 transition-transform {sortDir === 'desc'
													? ''
													: 'rotate-180'}"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										{/if}
									</button>
								</th>

								<th class="py-2 pr-4">
									<button class={thBtnClass('seances')} onclick={() => setSort('seances')}>
										Сеансов
										{#if sortBy === 'seances'}
											<svg
												class="h-3 w-3 transition-transform {sortDir === 'desc'
													? ''
													: 'rotate-180'}"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										{/if}
									</button>
								</th>

								<th class="py-2 pr-4">
									<button class={thBtnClass('occupancy')} onclick={() => setSort('occupancy')}>
										Загрузка
										{#if sortBy === 'occupancy'}
											<svg
												class="h-3 w-3 transition-transform {sortDir === 'desc'
													? ''
													: 'rotate-180'}"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										{/if}
									</button>
								</th>

								<th class="py-2">
									<button class={thBtnClass('share')} onclick={() => setSort('share')}>
										Доля выручки
										{#if sortBy === 'share'}
											<svg
												class="h-3 w-3 transition-transform {sortDir === 'desc'
													? ''
													: 'rotate-180'}"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										{/if}
									</button>
								</th>
							</tr>
						</thead>

						<tbody>
							{#each rowsSorted as e, i (e.title + '__' + e.hall)}
								<!-- уровень 1 -->
								<tr class="border-b border-slate-800 align-top last:border-none">
									<td class="py-2 pr-3 text-right align-top text-slate-400 tabular-nums">
										<button
											class="inline-flex items-center gap-1 text-slate-300 hover:text-white"
											onclick={() => toggleDetail(detailKey(e))}
											aria-expanded={expandedDetail.has(detailKey(e))}
											aria-label="Показать сеансы"
										>
											<span>{i + 1}</span>
											<svg
												class={'h-3 w-3 transition-transform ' +
													(expandedDetail.has(detailKey(e)) ? 'rotate-180' : '')}
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</button>
									</td>

									<td class="w-[22ch] min-w-0 py-2 pr-4 align-top sm:w-[28ch] md:w-[32ch]">
										<div
											class="clamp-2 max-w-full leading-snug break-words whitespace-normal"
											title={e.title}
										>
											{e.title}
										</div>
									</td>

									<td class="w-[16ch] py-2 pr-4 align-top break-words whitespace-normal sm:w-[18ch]"
										>{e.hall}</td
									>

									<td class="py-2 pr-4 align-top">
										<div class="flex flex-col leading-tight tabular-nums">
											<span class="whitespace-nowrap">{fmtRub(Math.round(e.sales))}</span>
											<span
												class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
													deltaClass(e._delta.sales)}
											>
												{fmtDeltaPct(e._delta.sales)}
											</span>
										</div>
									</td>

									<td class="py-2 pr-4 align-top">
										<div class="flex flex-col leading-tight tabular-nums">
											<span class="whitespace-nowrap">{fmtRub(Math.round(e.salesPerShow))}</span>
											<span
												class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
													deltaClass(e._delta.perShow)}
											>
												{fmtDeltaPct(e._delta.perShow)}
											</span>
										</div>
									</td>

									<td class="py-2 pr-4 align-top">
										<div class="flex flex-col leading-tight tabular-nums">
											<span class="whitespace-nowrap">{fmtRub(Math.round(e.tickets))}</span>
											<span
												class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
													deltaClass(e._delta.tickets)}
											>
												{fmtDeltaPct(e._delta.tickets)}
											</span>
										</div>
									</td>

									<td class="py-2 pr-4 align-top">
										<div class="flex flex-col leading-tight tabular-nums">
											<span class="whitespace-nowrap">{fmtRub(Math.round(e.avgPrice || 0))}</span>
											<span
												class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
													deltaClass(e._delta.avgPrice)}
											>
												{fmtDeltaPct(e._delta.avgPrice)}
											</span>
										</div>
									</td>

									<td class="py-2 pr-4 align-top">
										<div class="flex flex-col leading-tight tabular-nums">
											<span class="whitespace-nowrap">{e.seances}</span>
											<span
												class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
													deltaClass(e._delta.seances)}
											>
												{fmtDeltaPct(e._delta.seances)}
											</span>
										</div>
									</td>

									<td class="py-2 pr-4 align-top">
										<div class="flex flex-col leading-tight tabular-nums">
											<span class="whitespace-nowrap">{Math.round((e.occupancy ?? 0) * 100)}%</span>
											<span
												class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
													deltaClass(e._delta.occupancyPP)}
											>
												{fmtDeltaPP(e._delta.occupancyPP)}
											</span>
										</div>
									</td>

									<td class="py-2 align-top">
										<div class="flex flex-col leading-tight tabular-nums">
											<span class="whitespace-nowrap">{Math.round((e.share ?? 0) * 100)}%</span>
											<span
												class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
													deltaClass(e._delta.sharePP)}
											>
												{fmtDeltaPP(e._delta.sharePP)}
											</span>
										</div>
									</td>
								</tr>

								{#if expandedDetail.has(detailKey(e))}
									<tr class="bg-slate-800/60">
										<td colspan="10" class="p-0">
											<div class="px-4 pt-1 pb-3">
												<div class="overflow-x-auto">
													<table class="w-full min-w-[60rem] text-left text-xs sm:text-sm">
														<thead class="border-b border-slate-700 text-gray-400">
															<tr>
																<th class="py-1 pr-3 text-right">№</th>
																<th class="py-1 pr-4">Дата</th>
																<th class="py-1 pr-4">Время</th>
																<th class="py-1 pr-4">Продажи</th>
																<th class="py-1 pr-4">Билетов</th>
																<th class="py-1 pr-4">Ср. цена</th>
																<th class="py-1 pr-4">Заполняемость</th>
																<th class="py-1">Доля выручки</th>
															</tr>
														</thead>
														<tbody>
															{#each sessionsForEvent(e) as s, k}
																<tr class="border-b border-slate-800 last:border-none">
																	<td class="py-1 pr-3 text-right text-slate-400">{k + 1}</td>
																	<td class="py-1 pr-4 whitespace-nowrap">{s._dateStr}</td>
																	<td class="py-1 pr-4 whitespace-nowrap">{s._timeStr}</td>
																	<td class="py-1 pr-4">{fmtRub(s.sales)}</td>
																	<td class="py-1 pr-4">{fmtRub(s.tickets)}</td>
																	<td class="py-1 pr-4">{fmtRub(s.avgPrice)}</td>
																	<td class="py-1 pr-4">{fmtPercent01(s.occupancy ?? null, 0)}</td>
																	<td class="py-1">{fmtPercent01(s.share ?? 0, 1)}</td>
																</tr>
															{/each}
														</tbody>
													</table>
												</div>
											</div>
										</td>
									</tr>
								{/if}
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<!-- <section class="mx-auto w-full max-w-6xl p-6">
				<button
					class="mb-8 flex items-center gap-2 text-3xl font-bold"
					onclick={() => (eventsWithPicturesOpen = !eventsWithPicturesOpen)}
				>
					СПЕКТАКЛИ
					<svg
						class="h-6 w-6 transition-transform duration-200 {eventsWithPicturesOpen
							? 'rotate-180'
							: ''}"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</button>
				{#if eventsWithPicturesOpen}
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{#each theater.productions as p}
							<div
								class="relative h-80 overflow-hidden rounded-lg bg-cover bg-center transition-transform duration-300 hover:scale-105"
								style="background-image:url('{productionimg(p.foto)}')"
							>
								<div
									class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
								></div>
								<div class="absolute right-0 bottom-0 left-0 p-6">
									<h3 class="mb-2 text-xl font-bold">{p.name}</h3>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</section> -->
		</section>
	</div>

	<!-- Back to main button -->
	<button class="back-to-main-btn" onclick={goToMain} aria-label="Back to main">
		<ArrowLeft size={24} />
	</button>
</div>

<PersonPopup
	bind:isOpen={showPopup}
	person={selectedPerson}
	fallbackSrc={staffFallback}
	on:close={() => (showPopup = false)}
/>

<style>
	.back-to-main-btn {
		position: fixed;
		left: 1.5rem;
		top: 1.5rem;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: #374151;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.15s ease;
		border: none;
		outline: none;
		z-index: 50;
	}
	.back-to-main-btn:hover {
		transform: scale(1.08);
		background: #4b5563;
	}

	.clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
