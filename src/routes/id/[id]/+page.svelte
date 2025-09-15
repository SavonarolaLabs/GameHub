<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';

	// данные
	import { hr } from '$lib/hr';
	import { theaterSocials } from '$lib/theaterSocials';
	import { theaters } from '$lib/theaters-data';
	import { ticketOperator } from '$lib/ticketOperator';
	import { ranking } from '$lib/ranking';
	import { theatersPremiers } from '$lib/theatersPremiers';
	import { theatersFinance } from '$lib/theatersFinance';
	import { theatersExpenses } from '$lib/theatersExpenses';
	import { theatersDynamic } from '$lib/theatersDynamic';
	import { theatersOffbudget } from '$lib/theatersOffbudget';
	import { theatersStaff } from '$lib/theatersStaff';
	import { theatersEventsRaw } from '$lib/theatersEventsRaw';
	import { theatersSpacesExtra } from '$lib/theatersSpacesExtra';

	import GanttChart from '$lib/GanttChart.svelte';
	import PersonPopup from '$lib/PersonPopup.svelte';
	import { ArrowLeft } from 'lucide-svelte';

	import {
		filterRows,
		aggregateByTitleHall,
		aggregateByMonth,
		type OtherTypeMode,
		type EndedMode
	} from '$lib/aggEvents';

	// utils
	import {
		titleCase,
		joinTitleCase,
		trimTitles,
		formatPhone,
		fmtRub,
		fmtInt,
		fmtPercent01,
		hasStat,
		safeHref,
		formatRubAbbreviated,
		fmtDeltaPct,
		fmtDeltaPP,
		deltaClass
	} from '$lib/utils/format';
	import { onImgError, staffFallback, spaceFallback, photobankFallback } from '$lib/utils/images';

	// новые компоненты
	import TheaterHeader from '$lib/components/TheaterHeader.svelte';
	import StaffSection from '$lib/components/StaffSection.svelte';
	import SpacesAccordion from '$lib/components/SpacesAccordion.svelte';
	import FinanceBars from '$lib/components/FinanceBars.svelte';
	import FiltersBar from '$lib/components/FiltersBar.svelte';
	import ProductionsTable from '$lib/components/ProductionsTable.svelte';

	/* ---------- состояние ---------- */
	let theater: Theater = theaters[0];
	let BaseInfoOpen = false;
	let financeYear: 2024 | 2025 = 2024;

	let onlyMainStage = true;
	let otherMode: OtherTypeMode = 'exclude';
	let groupMode: 'year' | 'season' = 'year';
	let selectedSeason: number | null = null;
	let endedMode: EndedMode = 'all';

	// картинка-пути
	const theaterimg = (file: string) => `${base}/theaters/${file}_1.jpg`;
	const spaceimg = (file: string) => `${base}/spaces/${file}.jpg`;
	const productionimg = (file: string) => `${base}/productions/${file}.jpg`;
	const hrimg = (file: string) => `${base}/hr/${file}`;
	const socialsimg = (file: string) => `${base}/socials/${file}`;
	const getStaffPhoto = (file?: string | null) => (file ? hrimg(file) : staffFallback);

	// выбрать театр по url
	$: theater = theaters.find((t) => t.id === Number($page.params.id)) || theater;

	// сезоны
	$: availableSeasons = Array.from(
		new Set(
			theatersEventsRaw
				.filter((r) => r.theaterId === theater.id && r.season != null)
				.map((r: any) => Number(r.season))
				.filter((n) => Number.isFinite(n))
		)
	).sort((a, b) => b - a);

	$: if (groupMode === 'season' && selectedSeason == null && availableSeasons.length) {
		selectedSeason = availableSeasons[0];
	}

	// доп.инфа по площадкам
	const norm = (x?: unknown) => (x ?? '').toString().trim().toLowerCase();
	$: spacesExtra = theatersSpacesExtra.find((t) => t.id === theater.id)?.spaces ?? [];
	$: extraById = new Map(
		spacesExtra.filter((e) => e.spaceId != null).map((e) => [String(e.spaceId), e])
	);
	$: spacesEnriched = theater.spaces.map((s: any) => {
		const sid = s.id ?? s.space_id ?? s.spaceId ?? null;
		let extra = sid != null ? extraById.get(String(sid)) : undefined;
		if (!extra)
			extra = spacesExtra.find(
				(e) => norm(e.venue_space_short_name) === norm(s.venue_space_short_name)
			);
		return {
			...s,
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

	// финансы
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

	$: expenseData = (() => {
		const t = theatersExpenses.find((x) => x.id === theater.id);
		if (!t) return [];
		const yr = t.years.find((y) => y.year === financeYear);
		if (!yr) return [];
		const { total, breakdown } = yr;
		const pct = (v: number) => (v ? v : 0);
		return [
			{ label: 'Всего', percent: 1, value: `${formatRubAbbreviated(total)}` },
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
		];
	})();

	// премьеры/динамика
	$: premieres = theatersPremiers.find((t) => t.id === theater.id)?.premiers ?? [];
	$: dynamics = theatersDynamic.find((t) => t.id === theater.id)?.dynamic ?? [];

	// статы по штату
	$: staffRow = theatersStaff.find((x) => x.id === theater.id) ?? null;
	$: staff = staffRow?.staff ?? null;
	$: staffTotal = staff?.total ?? theater.employees ?? null;
	$: staffArtistic = staff?.artistic ?? theater.artistic_staff ?? null;
	$: staffArtists = staff?.artists ?? theater.cast ?? null;
	$: staffAdmin = staff?.admin ?? null;

	// таблица спектаклей
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
	$: eventSales = aggregateByTitleHall(filteredRaw);
	$: eventsByMonth = aggregateByMonth(filteredRaw);

	// соседний период
	$: availableSeasonsDesc = availableSeasons;
	$: prevSeason = (() => {
		if (groupMode !== 'season' || selectedSeason == null) return null;
		const idx = availableSeasonsDesc.indexOf(Number(selectedSeason));
		return idx !== -1 && idx < availableSeasonsDesc.length - 1
			? availableSeasonsDesc[idx + 1]
			: availableSeasonsDesc.includes(Number(selectedSeason) - 1)
				? Number(selectedSeason) - 1
				: null;
	})();
	$: prevYear = groupMode === 'year' ? financeYear - 1 : null;

	$: prevFilteredRaw = filterRows(theatersEventsRaw as any, {
		theaterId: theater.id,
		year: groupMode === 'year' ? (prevYear ?? undefined) : undefined,
		season: groupMode === 'season' ? (prevSeason ?? undefined) : undefined,
		mainStage: onlyMainStage ? true : undefined,
		otherTypeMode: otherMode,
		endedMode
	});
	$: prevEventSales = aggregateByTitleHall(prevFilteredRaw);

	function keyOf(e: { title: string; hall: string }) {
		return `${e.title}__${e.hall}`;
	}
	$: prevMap = new Map(prevEventSales.map((e) => [keyOf(e), e]));

	function pctDelta(cur?: number, prev?: number | null) {
		return typeof cur === 'number' && typeof prev === 'number' && isFinite(prev) && prev !== 0
			? (cur - prev) / prev
			: null;
	}
	function ppDelta(cur?: number, prev?: number | null) {
		return typeof cur === 'number' && typeof prev === 'number' ? (cur - prev) * 100 : null;
	}

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
				occupancyPP: ppDelta(e.occupancy, p?.occupancy),
				sharePP: ppDelta(e.share, p?.share),
				avgPrice: pctDelta(avgPrice, prevAvgPrice)
			}
		};
	});

	// сортировка (текущий ключ/направление храним тут, таблица только читает)
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
	function valueForSort(row: any, key: SortKey) {
		const v = row[key];
		if (v == null || Number.isNaN(v)) return -Infinity;
		return v;
	}
	$: rowsSorted = [...rowsWithDelta].sort((a, b) => {
		const va = valueForSort(a, sortBy),
			vb = valueForSort(b, sortBy);
		if (va === vb) return 0;
		const mul = sortDir === 'desc' ? -1 : 1;
		return va > vb ? mul : -mul;
	});

	// попап с биографией
	let showPopup = false;
	let selectedPerson = {
		name: 'Жуков Владимир Иванович',
		position: 'Директор',
		photo: 'path/to/photo.jpg',
		biography: 'Биография ...'
	};

	function handleOpenPerson(e: CustomEvent) {
		selectedPerson = e.detail;
		showPopup = true;
	}

	const goToMain = () => {
		window.location.href = '/';
	};

	// операторы/соцсети/ранг — подготовим для TheaterHeader
	$: opsForTheater = ticketOperator.find((s) => s.id == theater.id)?.operators ?? [];
	$: socialsForTheater = theaterSocials.find((s) => s.id == theater.id)?.socials ?? [];
	$: rank = ranking.find((r) => r.id === theater.id) ?? null;
	// ===== helpers для дат (локально) =====
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
	const fmtDate = (d: Date | null, fallback = '—') =>
		d ? d.toLocaleDateString('ru-RU') : fallback;
	const fmtTime = (d: Date | null, fallback = '—') =>
		d ? d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : fallback;

	// ===== prop для <ProductionsTable/> =====
	function sessionsForEvent(e: { title: string; hall: string }) {
		// уже отфильтрованные ряды под текущие фильтры
		const same = (filteredRaw as any[]).filter((r) => r.title === e.title && r.hall === e.hall);

		// сумма выручки в текущем срезе — для доли
		const theaterTotal = (eventSales as any[]).reduce((s, v) => s + (v.sales ?? 0), 0);

		return same
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
			.sort((a: any, b: any) => (+b._dt || 0) - (+a._dt || 0));
	}
</script>

<div class="flex min-h-screen w-full flex-col items-center">
	<div class="w-full bg-slate-900 text-white">
		<header class="mx-auto w-full max-w-6xl p-6 pt-25">
			<TheaterHeader
				{theater}
				{rank}
				operators={opsForTheater}
				socials={socialsForTheater}
				{theaterimg}
				{socialsimg}
			/>

			<StaffSection
				bind:open={BaseInfoOpen}
				{theater}
				hrRows={hr}
				{socialsimg}
				{getStaffPhoto}
				{staffTotal}
				{staffAdmin}
				{staffArtistic}
				{staffArtists}
				on:open-person={handleOpenPerson}
			/>
		</header>
	</div>

	<!-- контент -->
	<div class="w-full bg-slate-900 text-white">
		<section class="mx-auto w-full max-w-6xl p-6">
			<SpacesAccordion spaces={spacesEnriched} {spaceimg} />
		</section>

		<section class="mx-auto w-full max-w-6xl p-6">
			<h2 class="mb-8 text-3xl font-bold">КАЛЕНДАРЬ ПРЕМЬЕР</h2>
			<GanttChart items={premieres} />
		</section>

		<section class="mx-auto w-full max-w-6xl p-6">
			<h2 class="mb-8 text-3xl font-bold">Общая информация</h2>
			<FinanceBars {financeYear} {offbudgetData} {expenseData} />
		</section>

		<section class="mx-auto w-full max-w-6xl p-6">
			<h2 class="mb-8 text-3xl font-bold">Данные по спектаклям</h2>

			<FiltersBar
				bind:groupMode
				bind:financeYear
				{availableSeasons}
				bind:selectedSeason
				bind:onlyMainStage
				bind:otherMode
				bind:endedMode
			/>

			<ProductionsTable {rowsSorted} {sessionsForEvent} {sortBy} {sortDir} />
		</section>
	</div>

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
</style>
