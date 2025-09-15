<script lang="ts">
	import { base } from '$app/paths';
	import { theaters } from '$lib/theaters-data';
	import { theatersEventsRaw } from '$lib/theatersEventsRaw';
	import { filterRows, aggregateByTitleHall, type OtherTypeMode } from '$lib/aggEvents';
	import type { EndedMode } from '$lib/aggEvents';

	import { goto } from '$app/navigation';
	import { ArrowLeft } from 'lucide-svelte';

	const goToMain = () => goto(`${base}/`);

	// типы
	type Theater = (typeof theaters)[number];

	type MakeRowsArgs = {
		year?: number;
		season?: number | null;
		onlyMainStage: boolean;
		otherMode: OtherTypeMode;
		endedMode: EndedMode;
	};

	/* ---------- состояние фильтров ---------- */
	let groupMode: 'year' | 'season' = 'year';
	let financeYear: 2024 | 2025 = 2024;
	let selectedSeason: number | null = null;
	let onlyMainStage = true;
	let otherMode: OtherTypeMode = 'exclude';
	let endedMode: EndedMode = 'all';

	// переключатель таблиц
	let viewMode: 'theaters' | 'events' = 'theaters';

	// сезоны
	$: availableSeasons = Array.from(
		new Set(
			theatersEventsRaw
				.filter((r: any) => r.season != null)
				.map((r: any) => Number(r.season))
				.filter((n) => Number.isFinite(n))
		)
	).sort((a, b) => b - a);

	// сброс раскрытий при смене фильтров/вкладки
	let _inited = false;
	$: {
		groupMode;
		financeYear;
		selectedSeason;
		onlyMainStage;
		otherMode;
		endedMode;
		viewMode;
		if (_inited) {
			expanded = new Set(); // театры
			expandedDetail = new Set(); // мероприятия внутри театра
			expandedEventDetails = new Set(); // сеансы для строки «спектакль» во 2-й таблице
		}
		_inited = true;
	}

	$: if (groupMode === 'season' && selectedSeason == null && availableSeasons.length) {
		selectedSeason = availableSeasons[0];
	}

	/* ---------- форматирование/дельты ---------- */
	const fmtRub = (n: number) => new Intl.NumberFormat('ru-RU').format(Math.round(n));
	function fmtPercent01(x?: number | null, digits = 0) {
		if (x == null) return '—';
		return `${(x * 100).toFixed(digits)}%`;
	}
	function pctDelta(cur?: number, prev?: number | null) {
		return typeof cur === 'number' && typeof prev === 'number' && isFinite(prev) && prev !== 0
			? (cur - prev) / prev
			: null;
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

	/* ---------- парсинг дат для сеансов ---------- */
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
		const d2 = _parseMaybeDate(ts);
		return d2;
	}
	const fmtDate = (d: Date | null, fallback?: string) =>
		d ? d.toLocaleDateString('ru-RU') : (fallback ?? '—');
	const fmtTime = (d: Date | null, fallback?: string) =>
		d ? d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : (fallback ?? '—');

	/* ---------- вспомогательная выборка сеансов для строки мероприятия ---------- */
	function sessionsFor(theaterId: number, e: { title: string; hall: string }) {
		const raw = filterRows(theatersEventsRaw as any, {
			theaterId,
			year: groupMode === 'year' ? financeYear : undefined,
			season: groupMode === 'season' ? (selectedSeason ?? undefined) : undefined,
			mainStage: onlyMainStage ? true : undefined,
			otherTypeMode: otherMode,
			endedMode
		});
		const same = raw.filter((r: any) => r.title === e.title && r.hall === e.hall);

		const theaterTotal =
			currentRows.find((x) => x.id === theaterId)?.sales ??
			same.reduce((s: number, r: any) => s + (r.sales ?? 0), 0);

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
					typeof r.occupancy === 'number' ? r.occupancy : capacity ? tickets / capacity : null;
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

	/* =========================================================================
	   1) ТАБЛИЦА ПО ТЕАТРАМ (как была)
	   ========================================================================= */
	type Row = {
		id: number;
		name: string;
		sales: number;
		tickets: number;
		seances: number;
		perSeance: number;
		avgPrice: number;
		occupancy: number | null; // 0..1
		share: number; // 0..1 среди всех театров
	};

	function makeRows(opts: MakeRowsArgs) {
		const rows: Row[] = [];

		for (const t of theaters) {
			const raw = filterRows(theatersEventsRaw as any, {
				theaterId: t.id,
				year: groupMode === 'year' ? opts.year : undefined,
				season: groupMode === 'season' ? (opts.season ?? undefined) : undefined,
				mainStage: opts.onlyMainStage ? true : undefined,
				otherTypeMode: opts.otherMode,
				endedMode: opts.endedMode
			});
			if (!raw.length) continue;

			const byEvent = aggregateByTitleHall(raw);
			const sales = byEvent.reduce((s: number, e: any) => s + (e.sales ?? 0), 0);
			const tickets = byEvent.reduce((s: number, e: any) => s + (e.tickets ?? 0), 0);
			const seances = byEvent.reduce((s: number, e: any) => s + (e.seances ?? 0), 0);
			const occWeightedSum = byEvent.reduce(
				(s: number, e: any) => s + (e.occupancy ?? 0) * (e.seances ?? 0),
				0
			);
			const occupancy = seances > 0 ? occWeightedSum / seances : null;

			rows.push({
				id: t.id,
				name: t.name,
				sales,
				tickets,
				seances,
				perSeance: seances > 0 ? sales / seances : 0,
				avgPrice: tickets > 0 ? sales / tickets : 0,
				occupancy,
				share: 0
			});
		}

		const totalSales = rows.reduce((s, r) => s + r.sales, 0);
		for (const r of rows) r.share = totalSales > 0 ? r.sales / totalSales : 0;

		return rows;
	}

	// текущий/предыдущий периоды (театры)
	$: currentRows = makeRows({
		year: groupMode === 'year' ? financeYear : undefined,
		season: groupMode === 'season' ? selectedSeason : undefined,
		onlyMainStage,
		otherMode,
		endedMode
	});
	$: prevPeriod =
		groupMode === 'year'
			? { year: (financeYear - 1) as number | undefined, season: undefined }
			: {
					year: undefined,
					season: (() => {
						if (selectedSeason == null) return undefined;
						const idx = availableSeasons.indexOf(Number(selectedSeason));
						return idx !== -1 && idx < availableSeasons.length - 1
							? availableSeasons[idx + 1]
							: availableSeasons.includes(Number(selectedSeason) - 1)
								? Number(selectedSeason) - 1
								: undefined;
					})()
				};
	$: prevRows = makeRows({
		year: prevPeriod.year,
		season: prevPeriod.season,
		onlyMainStage,
		otherMode,
		endedMode
	});
	$: prevMap = new Map(prevRows.map((r) => [r.id, r]));
	$: rowsWithDelta = currentRows.map((r) => {
		const p = prevMap.get(r.id);
		return {
			...r,
			_delta: {
				sales: pctDelta(r.sales, p?.sales),
				tickets: pctDelta(r.tickets, p?.tickets),
				perSeance: pctDelta(r.perSeance, p?.perSeance),
				avgPrice: pctDelta(r.avgPrice, p?.avgPrice),
				occupancyPP: ppDelta(r.occupancy ?? null, p?.occupancy ?? null),
				sharePP: ppDelta(r.share, p?.share)
			}
		};
	});

	// сортировка (театры)
	type SortKey = 'sales' | 'tickets' | 'perSeance' | 'avgPrice' | 'occupancy' | 'share';
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
	$: visible = [...rowsWithDelta].sort((a, b) => {
		const va = a[sortBy] ?? -Infinity;
		const vb = b[sortBy] ?? -Infinity;
		const mul = sortDir === 'desc' ? -1 : 1;
		return va > vb ? mul : va < vb ? -mul : 0;
	});

	// раскрытие (театры → мероприятия → сеансы)
	let expanded = new Set<number>();
	let expandedDetail = new Set<string>();
	function detailKey(theaterId: number, e: any) {
		return `${theaterId}__${e.title}__${e.hall}`;
	}
	function toggleDetail(key: string) {
		const next = new Set(expandedDetail);
		if (next.has(key)) next.delete(key);
		else next.add(key);
		expandedDetail = next;
	}
	function toggleExpand(id: number) {
		const next = new Set(expanded);
		if (next.has(id)) {
			next.delete(id);
			expandedDetail = new Set([...expandedDetail].filter((k) => !k.startsWith(id + '__')));
		} else {
			next.add(id);
		}
		expanded = next;
	}
	function detailsFor(theaterId: number) {
		const raw = filterRows(theatersEventsRaw as any, {
			theaterId,
			year: groupMode === 'year' ? financeYear : undefined,
			season: groupMode === 'season' ? (selectedSeason ?? undefined) : undefined,
			mainStage: onlyMainStage ? true : undefined,
			otherTypeMode: otherMode,
			endedMode
		});
		const byEvent = aggregateByTitleHall(raw);
		return byEvent.sort((a: any, b: any) => (b.sales ?? 0) - (a.sales ?? 0));
	}

	/* =========================================================================
	   2) ТАБЛИЦА ПО СПЕКТАКЛЯМ (общий список по всем театрам)
	   ========================================================================= */
	type EventRow = {
		theaterId: number;
		theaterName: string;
		title: string;
		hall: string;
		sales: number;
		tickets: number;
		seances: number;
		salesPerShow: number;
		avgPrice: number;
		occupancy: number | null; // 0..1
		share: number; // доля среди всех спектаклей набора
	};
	function keyEvent(r: { theaterId: number; title: string; hall: string }) {
		return `${r.theaterId}__${r.title}__${r.hall}`;
	}

	function makeEventRows(opts: MakeRowsArgs): EventRow[] {
		const out: EventRow[] = [];
		for (const t of theaters) {
			const raw = filterRows(theatersEventsRaw as any, {
				theaterId: t.id,
				year: groupMode === 'year' ? opts.year : undefined,
				season: groupMode === 'season' ? (opts.season ?? undefined) : undefined,
				mainStage: opts.onlyMainStage ? true : undefined,
				otherTypeMode: opts.otherMode,
				endedMode: opts.endedMode
			});
			if (!raw.length) continue;

			const byEvent = aggregateByTitleHall(raw);
			for (const e of byEvent) {
				const sales = e.sales ?? 0;
				const tickets = e.tickets ?? 0;
				const seances = e.seances ?? 0;
				out.push({
					theaterId: t.id,
					theaterName: t.name,
					title: e.title,
					hall: e.hall,
					sales,
					tickets,
					seances,
					salesPerShow: seances > 0 ? sales / seances : 0,
					avgPrice: tickets > 0 ? sales / tickets : 0,
					occupancy: e.occupancy ?? null,
					share: 0
				});
			}
		}
		const totalSales = out.reduce((s, r) => s + r.sales, 0);
		for (const r of out) r.share = totalSales > 0 ? r.sales / totalSales : 0;
		return out;
	}

	// текущий/предыдущий периоды (спектакли)
	$: currentEventRows = makeEventRows({
		year: groupMode === 'year' ? financeYear : undefined,
		season: groupMode === 'season' ? selectedSeason : undefined,
		onlyMainStage,
		otherMode,
		endedMode
	});
	$: prevEventRows = makeEventRows({
		year: prevPeriod.year,
		season: prevPeriod.season,
		onlyMainStage,
		otherMode,
		endedMode
	});
	$: prevEventMap = new Map(prevEventRows.map((r) => [keyEvent(r), r]));
	$: eventRowsWithDelta = currentEventRows.map((r) => {
		const p = prevEventMap.get(keyEvent(r));
		return {
			...r,
			_delta: {
				sales: pctDelta(r.sales, p?.sales),
				tickets: pctDelta(r.tickets, p?.tickets),
				perShow: pctDelta(r.salesPerShow, p?.salesPerShow),
				avgPrice: pctDelta(r.avgPrice, p?.avgPrice),
				occupancyPP: ppDelta(r.occupancy ?? null, p?.occupancy ?? null),
				sharePP: ppDelta(r.share, p?.share)
			}
		};
	});

	// сортировка (спектакли)
	type EventSortKey =
		| 'sales'
		| 'salesPerShow'
		| 'tickets'
		| 'avgPrice'
		| 'seances'
		| 'occupancy'
		| 'share';
	let sortByEvents: EventSortKey = 'sales';
	let sortDirEvents: 'desc' | 'asc' = 'desc';
	const thBtnClassEv = (k: EventSortKey) =>
		`flex items-center gap-1 hover:underline ${sortByEvents === k ? 'text-blue-400' : ''}`;
	function setSortEv(k: EventSortKey) {
		if (sortByEvents === k) sortDirEvents = sortDirEvents === 'desc' ? 'asc' : 'desc';
		else {
			sortByEvents = k;
			sortDirEvents = 'desc';
		}
	}
	function valueForSortEv(row: any, key: EventSortKey) {
		const v = row[key];
		return v == null || Number.isNaN(v) ? -Infinity : v;
	}
	$: visibleEvents = [...eventRowsWithDelta].sort((a, b) => {
		const va = valueForSortEv(a, sortByEvents);
		const vb = valueForSortEv(b, sortByEvents);
		const mul = sortDirEvents === 'desc' ? -1 : 1;
		return va > vb ? mul : va < vb ? -mul : 0;
	});

	// раскрытие (строка спектакля → сеансы)
	let expandedEventDetails = new Set<string>();
	function toggleEventDetail(key: string) {
		const next = new Set(expandedEventDetails);
		if (next.has(key)) next.delete(key);
		else next.add(key);
		expandedEventDetails = next;
	}
</script>

<svelte:head>
	<title>Рейтинг — Театры Москвы</title>
	<meta name="description" content="Рейтинг театров и спектаклей Москвы" />
</svelte:head>

<div class="min-h-screen bg-slate-900 text-white">
	<button class="back-to-main-btn" on:click={goToMain} aria-label="На главную">
		<ArrowLeft size={24} />
	</button>

	<header class="mx-auto w-full max-w-6xl px-6 py-8">
		<h1 class="mb-2 text-4xl font-bold">
			Рейтинг {viewMode === 'theaters' ? 'театров' : 'спектаклей'}
		</h1>
		<p class="mb-6 text-gray-400">
			{viewMode === 'theaters'
				? 'Сравнение театров по продажам, билетам и заполняемости'
				: 'Сравнение спектаклей по всем театрам'}
		</p>

		<!-- Переключатель вида -->
		<div class="mb-4 flex gap-2">
			<button
				class={'rounded-md px-3 py-1 text-sm font-semibold ' +
					(viewMode === 'theaters'
						? 'bg-sky-600/60 text-sky-300 ring-1 ring-sky-500/40 hover:bg-sky-500'
						: 'bg-slate-600 text-gray-300 hover:bg-slate-700')}
				on:click={() => (viewMode = 'theaters')}
			>
				Театры
			</button>
			<button
				class={'rounded-md px-3 py-1 text-sm font-semibold ' +
					(viewMode === 'events'
						? 'bg-sky-600/60 text-sky-300 ring-1 ring-sky-500/40 hover:bg-sky-500'
						: 'bg-slate-600 text-gray-300 hover:bg-slate-700')}
				on:click={() => (viewMode = 'events')}
			>
				Спектакли
			</button>
		</div>

		<!-- Фильтры -->
		<div class="mb-6 flex flex-wrap items-center gap-3">
			<label class="flex items-center gap-2">
				<span class="text-gray-400">Группировка:</span>
				<select bind:value={groupMode} class="rounded bg-slate-700 px-2 py-1">
					<option value="year">по году</option>
					<option value="season">по сезону</option>
				</select>
			</label>

			{#if groupMode === 'year'}
				<button
					class={'rounded-md px-3 py-1 text-sm font-semibold ' +
						(financeYear === 2024
							? 'bg-sky-600/60 text-sky-300 ring-1 ring-sky-500/40 hover:bg-sky-500'
							: 'bg-slate-600 text-gray-300 hover:bg-slate-700')}
					on:click={() => (financeYear = 2024 as 2024)}
				>
					2024
				</button>
				<button
					class={'rounded-md px-3 py-1 text-sm font-semibold ' +
						(financeYear === 2025
							? 'bg-sky-600/60 text-sky-300 ring-1 ring-sky-500/40 hover:bg-sky-500'
							: 'bg-slate-600 text-gray-300 hover:bg-slate-700')}
					on:click={() => (financeYear = 2025 as 2025)}
				>
					2025
				</button>
			{:else}
				<label class="flex items-center gap-2">
					<span class="text-gray-400">Сезон:</span>
					<select
						bind:value={selectedSeason}
						class="rounded bg-slate-700 px-2 py-1"
						on:change={(e) =>
							(selectedSeason = Number((e.currentTarget as HTMLSelectElement).value))}
					>
						{#each availableSeasons as s}
							<option value={s}>{s}</option>
						{/each}
					</select>
				</label>
			{/if}

			<label class="ml-2 flex items-center gap-2">
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
	</header>

	<!-- ТАБЛИЦЫ -->
	<main class="mx-auto w-full max-w-6xl px-6 pb-12">
		{#if viewMode === 'theaters'}
			<!-- ===== Таблица по театрам (как была) ===== -->
			<div class="-mx-6 md:mx-0">
				<div class="overflow-x-auto overscroll-x-contain">
					<table class="w-full min-w-[78rem] text-left">
						<thead class="border-b border-slate-700 text-gray-400">
							<tr>
								<th class="py-2 pr-3 text-right">№</th>
								<th class="py-2 pr-4">Театр</th>

								<th class="py-2 pr-4">
									<button class={thBtnClass('sales')} on:click={() => setSort('sales')}>
										Продажи
										{#if sortBy === 'sales'}
											<svg
												class="h-3 w-3 transition-transform {sortDir === 'desc'
													? ''
													: 'rotate-180'}"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/></svg
											>
										{/if}
									</button>
								</th>

								<th class="py-2 pr-4">
									<button class={thBtnClass('perSeance')} on:click={() => setSort('perSeance')}>
										на 1 сеанс
										{#if sortBy === 'perSeance'}
											<svg
												class="h-3 w-3 transition-transform {sortDir === 'desc'
													? ''
													: 'rotate-180'}"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/></svg
											>
										{/if}
									</button>
								</th>

								<th class="py-2 pr-4">
									<button class={thBtnClass('tickets')} on:click={() => setSort('tickets')}>
										Билетов
										{#if sortBy === 'tickets'}
											<svg
												class="h-3 w-3 transition-transform {sortDir === 'desc'
													? ''
													: 'rotate-180'}"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/></svg
											>
										{/if}
									</button>
								</th>

								<th class="py-2 pr-4">
									<button class={thBtnClass('avgPrice')} on:click={() => setSort('avgPrice')}>
										Средняя цена
										{#if sortBy === 'avgPrice'}
											<svg
												class="h-3 w-3 transition-transform {sortDir === 'desc'
													? ''
													: 'rotate-180'}"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/></svg
											>
										{/if}
									</button>
								</th>

								<th class="py-2 pr-4">
									<button class={thBtnClass('seances')} on:click={() => setSort('seances')}>
										Сеансов
										{#if sortBy === 'seances'}
											<svg
												class="h-3 w-3 transition-transform {sortDir === 'desc'
													? ''
													: 'rotate-180'}"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/></svg
											>
										{/if}
									</button>
								</th>

								<th class="py-2 pr-4">
									<button class={thBtnClass('occupancy')} on:click={() => setSort('occupancy')}>
										Заполняемость
										{#if sortBy === 'occupancy'}
											<svg
												class="h-3 w-3 transition-transform {sortDir === 'desc'
													? ''
													: 'rotate-180'}"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/></svg
											>
										{/if}
									</button>
								</th>

								<th class="py-2">
									<button class={thBtnClass('share')} on:click={() => setSort('share')}>
										Доля выручки
										{#if sortBy === 'share'}
											<svg
												class="h-3 w-3 transition-transform {sortDir === 'desc'
													? ''
													: 'rotate-180'}"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/></svg
											>
										{/if}
									</button>
								</th>
							</tr>
						</thead>

						<tbody>
							{#each visible as r, i (r.id)}
								<tr class="border-b border-slate-800 align-top last:border-none">
									<td class="py-2 pr-3 text-right align-top text-slate-400 tabular-nums">
										<button
											class="inline-flex items-center gap-1 text-slate-300 hover:text-white"
											on:click={() => toggleExpand(r.id)}
											aria-expanded={expanded.has(r.id)}
											aria-label="Показать мероприятия театра"
										>
											<span>{i + 1}</span>
											<svg
												class={'h-3 w-3 transition-transform ' +
													(expanded.has(r.id) ? 'rotate-180' : '')}
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/></svg
											>
										</button>
									</td>

									<td class="py-2 pr-4">
										<a class="text-blue-300 hover:underline" href={`${base}/id/${r.id}`}>{r.name}</a
										>
									</td>

									<td class="py-2 pr-4">
										<div class="flex flex-col leading-tight tabular-nums">
											<span class="whitespace-nowrap">{fmtRub(r.sales)}</span>
											<span
												class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
													deltaClass(r._delta.sales)}>{fmtDeltaPct(r._delta.sales)}</span
											>
										</div>
									</td>

									<td class="py-2 pr-4">
										<div class="flex flex-col leading-tight tabular-nums">
											<span class="whitespace-nowrap">{fmtRub(r.perSeance)}</span>
											<span
												class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
													deltaClass(r._delta.perSeance)}>{fmtDeltaPct(r._delta.perSeance)}</span
											>
										</div>
									</td>

									<td class="py-2 pr-4">
										<div class="flex flex-col leading-tight tabular-nums">
											<span class="whitespace-nowrap">{fmtRub(r.tickets)}</span>
											<span
												class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
													deltaClass(r._delta.tickets)}>{fmtDeltaPct(r._delta.tickets)}</span
											>
										</div>
									</td>

									<td class="py-2 pr-4">
										<div class="flex flex-col leading-tight tabular-nums">
											<span class="whitespace-nowrap">{fmtRub(r.avgPrice)}</span>
											<span
												class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
													deltaClass(r._delta.avgPrice)}>{fmtDeltaPct(r._delta.avgPrice)}</span
											>
										</div>
									</td>

									<td class="py-2 pr-4">
										<div class="flex flex-col leading-tight tabular-nums">
											<span class="whitespace-nowrap">{r.seances}</span>
											<span
												class={'mt-0.5 text-xs font-medium whitespace-nowrap ' + deltaClass(null)}
											></span>
										</div>
									</td>

									<td class="py-2 pr-4">
										<div class="flex flex-col leading-tight tabular-nums">
											<span class="whitespace-nowrap">{fmtPercent01(r.occupancy, 0)}</span>
											<span
												class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
													deltaClass(r._delta.occupancyPP)}>{fmtDeltaPP(r._delta.occupancyPP)}</span
											>
										</div>
									</td>

									<td class="py-2">
										<div class="flex flex-col leading-tight tabular-nums">
											<span class="whitespace-nowrap">{fmtPercent01(r.share, 1)}</span>
											<span
												class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
													deltaClass(r._delta.sharePP)}>{fmtDeltaPP(r._delta.sharePP)}</span
											>
										</div>
									</td>
								</tr>

								{#if expanded.has(r.id)}
									<tr class="bg-slate-800/40">
										<td colspan="9" class="p-0">
											<div class="px-4 pt-1 pb-4">
												<div class="overflow-x-auto">
													<table class="w-full min-w-[70rem] text-left text-sm">
														<thead class="border-b border-slate-700 text-gray-400">
															<tr>
																<th class="py-1 pr-3 text-right">№</th>
																<th class="py-1 pr-4">Название</th>
																<th class="py-1 pr-4">Сцена</th>
																<th class="py-1 pr-4">Продажи</th>
																<th class="py-1 pr-4">на 1 показ</th>
																<th class="py-1 pr-4">Билетов</th>
																<th class="py-1 pr-4">Ср. цена</th>
																<th class="py-1 pr-4">Сеансов</th>
																<th class="py-1 pr-4">Заполняемость</th>
																<th class="py-1">Доля выручки</th>
															</tr>
														</thead>
														<tbody>
															{#each detailsFor(r.id) as e, j (e.title + '__' + e.hall)}
																<tr class="border-b border-slate-800 last:border-none">
																	<td class="py-1 pr-3 text-right text-slate-400">
																		<button
																			class="inline-flex items-center gap-1 text-slate-300 hover:text-white"
																			on:click={() => toggleDetail(detailKey(r.id, e))}
																			aria-expanded={expandedDetail.has(detailKey(r.id, e))}
																			aria-label="Показать сеансы мероприятия"
																		>
																			<span>{j + 1}</span>
																			<svg
																				class={'h-3 w-3 transition-transform ' +
																					(expandedDetail.has(detailKey(r.id, e))
																						? 'rotate-180'
																						: '')}
																				viewBox="0 0 24 24"
																				fill="none"
																				stroke="currentColor"
																				><path
																					stroke-linecap="round"
																					stroke-linejoin="round"
																					stroke-width="2"
																					d="M19 9l-7 7-7-7"
																				/></svg
																			>
																		</button>
																	</td>

																	<td class="py-1 pr-4">{e.title}</td>
																	<td class="py-1 pr-4">{e.hall}</td>
																	<td class="py-1 pr-4">{fmtRub(e.sales ?? 0)}</td>
																	<td class="py-1 pr-4">{fmtRub(e.salesPerShow ?? 0)}</td>
																	<td class="py-1 pr-4">{fmtRub(e.tickets ?? 0)}</td>
																	<td class="py-1 pr-4"
																		>{fmtRub(
																			(e.tickets ?? 0) > 0 ? (e.sales ?? 0) / e.tickets : 0
																		)}</td
																	>
																	<td class="py-1 pr-4">{e.seances ?? 0}</td>
																	<td class="py-1 pr-4">{fmtPercent01(e.occupancy ?? null, 0)}</td>
																	<td class="py-1">{fmtPercent01(e.share ?? 0, 1)}</td>
																</tr>

																{#if expandedDetail.has(detailKey(r.id, e))}
																	<tr class="bg-slate-800/60">
																		<td colspan="10" class="p-0">
																			<div class="px-4 pt-1 pb-3">
																				<div class="overflow-x-auto">
																					<table
																						class="w-full min-w-[66rem] text-left text-xs sm:text-sm"
																					>
																						<thead class="border-b border-slate-700 text-gray-400">
																							<tr>
																								<th class="py-1 pr-3 text-right">№</th>
																								<th class="py-1 pr-4">Название</th>
																								<th class="py-1 pr-4">Сцена</th>
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
																							{#each sessionsFor(r.id, e) as s, k}
																								<tr
																									class="border-b border-slate-800 last:border-none"
																								>
																									<td class="py-1 pr-3 text-right text-slate-400"
																										>{k + 1}</td
																									>
																									<td class="py-1 pr-4">{s.title}</td>
																									<td class="py-1 pr-4">{s.hall}</td>
																									<td class="py-1 pr-4 whitespace-nowrap"
																										>{s._dateStr}</td
																									>
																									<td class="py-1 pr-4 whitespace-nowrap"
																										>{s._timeStr}</td
																									>
																									<td class="py-1 pr-4">{fmtRub(s.sales)}</td>
																									<td class="py-1 pr-4">{fmtRub(s.tickets)}</td>
																									<td class="py-1 pr-4">{fmtRub(s.avgPrice)}</td>
																									<td class="py-1 pr-4"
																										>{fmtPercent01(s.occupancy ?? null, 0)}</td
																									>
																									<td class="py-1"
																										>{fmtPercent01(s.share ?? 0, 1)}</td
																									>
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
										</td>
									</tr>
								{/if}
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{:else}
			<!-- ===== Таблица по спектаклям (общий список) ===== -->
			<div class="-mx-6 md:mx-0">
				<div class="overflow-x-auto overscroll-x-contain">
					<table class="w-full min-w-[88rem] text-left">
						<thead class="border-b border-slate-700 text-gray-400">
							<tr>
								<th class="py-2 pr-3 text-right">№</th>
								<th class="py-2 pr-4">Театр</th>
								<th class="py-2 pr-4">Название</th>
								<th class="py-2 pr-4">Сцена</th>

								<th class="py-2 pr-4">
									<button class={thBtnClassEv('sales')} on:click={() => setSortEv('sales')}>
										Продажи
										{#if sortByEvents === 'sales'}
											<svg
												class="h-3 w-3 transition-transform {sortDirEvents === 'desc'
													? ''
													: 'rotate-180'}"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/></svg
											>
										{/if}
									</button>
								</th>

								<th class="py-2 pr-4">
									<button
										class={thBtnClassEv('salesPerShow')}
										on:click={() => setSortEv('salesPerShow')}
									>
										на 1 показ
										{#if sortByEvents === 'salesPerShow'}
											<svg
												class="h-3 w-3 transition-transform {sortDirEvents === 'desc'
													? ''
													: 'rotate-180'}"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/></svg
											>
										{/if}
									</button>
								</th>

								<th class="py-2 pr-4">
									<button class={thBtnClassEv('tickets')} on:click={() => setSortEv('tickets')}>
										Билетов
										{#if sortByEvents === 'tickets'}
											<svg
												class="h-3 w-3 transition-transform {sortDirEvents === 'desc'
													? ''
													: 'rotate-180'}"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/></svg
											>
										{/if}
									</button>
								</th>

								<th class="py-2 pr-4">
									<button class={thBtnClassEv('avgPrice')} on:click={() => setSortEv('avgPrice')}>
										Средняя цена
										{#if sortByEvents === 'avgPrice'}
											<svg
												class="h-3 w-3 transition-transform {sortDirEvents === 'desc'
													? ''
													: 'rotate-180'}"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/></svg
											>
										{/if}
									</button>
								</th>

								<th class="py-2 pr-4">
									<button class={thBtnClassEv('seances')} on:click={() => setSortEv('seances')}>
										Сеансов
										{#if sortByEvents === 'seances'}
											<svg
												class="h-3 w-3 transition-transform {sortDirEvents === 'desc'
													? ''
													: 'rotate-180'}"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/></svg
											>
										{/if}
									</button>
								</th>

								<th class="py-2 pr-4">
									<button class={thBtnClassEv('occupancy')} on:click={() => setSortEv('occupancy')}>
										Заполняемость
										{#if sortByEvents === 'occupancy'}
											<svg
												class="h-3 w-3 transition-transform {sortDirEvents === 'desc'
													? ''
													: 'rotate-180'}"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/></svg
											>
										{/if}
									</button>
								</th>

								<th class="py-2">
									<button class={thBtnClassEv('share')} on:click={() => setSortEv('share')}>
										Доля выручки
										{#if sortByEvents === 'share'}
											<svg
												class="h-3 w-3 transition-transform {sortDirEvents === 'desc'
													? ''
													: 'rotate-180'}"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/></svg
											>
										{/if}
									</button>
								</th>
							</tr>
						</thead>

						<tbody>
							{#each visibleEvents as r, i (keyEvent(r))}
								<tr class="border-b border-slate-800 align-top last:border-none">
									<td class="py-2 pr-3 text-right align-top text-slate-400 tabular-nums">
										<button
											class="inline-flex items-center gap-1 text-slate-300 hover:text-white"
											on:click={() => toggleEventDetail(keyEvent(r))}
											aria-expanded={expandedEventDetails.has(keyEvent(r))}
											aria-label="Показать сеансы спектакля"
										>
											<span>{i + 1}</span>
											<svg
												class={'h-3 w-3 transition-transform ' +
													(expandedEventDetails.has(keyEvent(r)) ? 'rotate-180' : '')}
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/></svg
											>
										</button>
									</td>

									<td class="py-2 pr-4">
										<a class="text-blue-300 hover:underline" href={`${base}/id/${r.theaterId}`}
											>{r.theaterName}</a
										>
									</td>

									<td class="w-[26ch] min-w-0 py-2 pr-4 align-top sm:w-[32ch] md:w-[36ch]">
										<div
											class="clamp-2 max-w-full leading-snug break-words whitespace-normal"
											title={r.title}
										>
											{r.title}
										</div>
									</td>

									<td class="py-2 pr-4">{r.hall}</td>

									<td class="py-2 pr-4">
										<div class="flex flex-col leading-tight tabular-nums">
											<span class="whitespace-nowrap">{fmtRub(r.sales)}</span>
											<span
												class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
													deltaClass(r._delta.sales)}>{fmtDeltaPct(r._delta.sales)}</span
											>
										</div>
									</td>

									<td class="py-2 pr-4">
										<div class="flex flex-col leading-tight tabular-nums">
											<span class="whitespace-nowrap">{fmtRub(r.salesPerShow)}</span>
											<span
												class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
													deltaClass(r._delta.perShow)}>{fmtDeltaPct(r._delta.perShow)}</span
											>
										</div>
									</td>

									<td class="py-2 pr-4">
										<div class="flex flex-col leading-tight tabular-nums">
											<span class="whitespace-nowrap">{fmtRub(r.tickets)}</span>
											<span
												class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
													deltaClass(r._delta.tickets)}>{fmtDeltaPct(r._delta.tickets)}</span
											>
										</div>
									</td>

									<td class="py-2 pr-4">
										<div class="flex flex-col leading-tight tabular-nums">
											<span class="whitespace-nowrap">{fmtRub(r.avgPrice)}</span>
											<span
												class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
													deltaClass(r._delta.avgPrice)}>{fmtDeltaPct(r._delta.avgPrice)}</span
											>
										</div>
									</td>

									<td class="py-2 pr-4">
										<div class="flex flex-col leading-tight tabular-nums">
											<span class="whitespace-nowrap">{r.seances}</span>
											<span
												class={'mt-0.5 text-xs font-medium whitespace-nowrap ' + deltaClass(null)}
											></span>
										</div>
									</td>

									<td class="py-2 pr-4">
										<div class="flex flex-col leading-tight tabular-nums">
											<span class="whitespace-nowrap">{fmtPercent01(r.occupancy, 0)}</span>
											<span
												class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
													deltaClass(r._delta.occupancyPP)}>{fmtDeltaPP(r._delta.occupancyPP)}</span
											>
										</div>
									</td>

									<td class="py-2">
										<div class="flex flex-col leading-tight tabular-nums">
											<span class="whitespace-nowrap">{fmtPercent01(r.share, 1)}</span>
											<span
												class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
													deltaClass(r._delta.sharePP)}>{fmtDeltaPP(r._delta.sharePP)}</span
											>
										</div>
									</td>
								</tr>

								{#if expandedEventDetails.has(keyEvent(r))}
									<tr class="bg-slate-800/60">
										<td colspan="11" class="p-0">
											<div class="px-4 pt-1 pb-3">
												<div class="overflow-x-auto">
													<table class="w-full min-w-[66rem] text-left text-xs sm:text-sm">
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
															{#each sessionsFor( r.theaterId, { title: r.title, hall: r.hall } ) as s, k}
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
		{/if}
	</main>
</div>

<style>
	.tabular-nums {
		font-variant-numeric: tabular-nums;
	}
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
