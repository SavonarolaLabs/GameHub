<script lang="ts">
	import { base } from '$app/paths';
	import { theaters } from '$lib/theaters-data';
	import { theatersEventsRaw } from '$lib/theatersEventsRaw';
	import { filterRows, aggregateByTitleHall, type OtherTypeMode } from '$lib/aggEvents';
	import type { EndedMode } from '$lib/aggEvents';

	import { goto } from '$app/navigation';
	import { ArrowLeft } from 'lucide-svelte';

	const goToMain = () => goto(`${base}/`);

	// Берём тип театра из массива данных
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

	// все доступные сезоны по всем театрам
	$: availableSeasons = Array.from(
		new Set(
			theatersEventsRaw
				.filter((r: any) => r.season != null)
				.map((r: any) => Number(r.season))
				.filter((n) => Number.isFinite(n))
		)
	).sort((a, b) => b - a);

	$: groupMode,
		financeYear,
		selectedSeason,
		onlyMainStage,
		otherMode,
		endedMode,
		() => {
			expanded = new Set();
		};

	let _inited = false;

	$: {
		// зависимости — любое их изменение триггерит блок
		groupMode;
		financeYear;
		selectedSeason;
		onlyMainStage;
		otherMode;
		endedMode;

		if (_inited) {
			// очищаем раскрытые строки
			expanded = new Set();
		}
		_inited = true;
	}

	$: if (groupMode === 'season' && selectedSeason == null && availableSeasons.length) {
		selectedSeason = availableSeasons[0];
	}

	/* ---------- хелперы форматирования/дельт ---------- */
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

	/* ---------- агрегация по театрам ---------- */
	type Row = {
		id: number;
		name: string;
		sales: number;
		tickets: number;
		seances: number;
		perSeance: number;
		avgPrice: number;
		occupancy: number | null; // 0..1
		share: number; // 0..1
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

			// агрегируем по (Название+Сцена), а затем суммируем показатели по театру
			const byEvent = aggregateByTitleHall(raw);

			const sales = byEvent.reduce((s: number, e: any) => s + (e.sales ?? 0), 0);
			const tickets = byEvent.reduce((s: number, e: any) => s + (e.tickets ?? 0), 0);
			const seances = byEvent.reduce((s: number, e: any) => s + (e.seances ?? 0), 0);

			// средняя заполняемость взвешенно по числу сеансов
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
				share: 0 // заполним ниже
			});
		}

		// доля выручки среди всех театров
		const totalSales = rows.reduce((s, r) => s + r.sales, 0);
		for (const r of rows) r.share = totalSales > 0 ? r.sales / totalSales : 0;

		return rows;
	}

	// текущий период
	$: currentRows = makeRows({
		year: groupMode === 'year' ? financeYear : undefined,
		season: groupMode === 'season' ? selectedSeason : undefined,
		onlyMainStage,
		otherMode,
		endedMode
	});

	// предыдущий период (год назад или предыдущий сезон)
	$: prevPeriod =
		groupMode === 'year'
			? { year: (financeYear - 1) as number | undefined, season: undefined }
			: {
					year: undefined,
					season: (() => {
						if (selectedSeason == null) return undefined;
						// берём следующий элемент в убывающем списке или просто сезон-1
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

	// добавляем дельты
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

	/* ---------- сортировка ---------- */
	type SortKey = 'sales' | 'tickets' | 'perSeance' | 'avgPrice' | 'occupancy' | 'share';
	let sortBy: SortKey = 'sales';
	let sortDir: 'desc' | 'asc' = 'desc';
	// после let sortBy / sortDir и функции setSort(...)
	const thBtnClass = (k: SortKey) =>
		`flex items-center gap-1 hover:underline ${sortBy === k ? 'text-blue-400' : ''}`;

	function setSort(k: SortKey) {
		if (sortBy === k) sortDir = sortDir === 'desc' ? 'asc' : 'desc';
		else {
			sortBy = k;
			sortDir = 'desc';
		}
	}

	let expanded = new Set<number>();
	function toggleExpand(id: number) {
		// пересоздаём Set, чтобы сработала реактивность
		const next = new Set(expanded);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		expanded = next;
	}

	// агрегированная детализация по театру (с учётом текущих фильтров)
	function detailsFor(theaterId: number) {
		const raw = filterRows(theatersEventsRaw as any, {
			theaterId,
			year: groupMode === 'year' ? financeYear : undefined,
			season: groupMode === 'season' ? (selectedSeason ?? undefined) : undefined,
			mainStage: onlyMainStage ? true : undefined,
			otherTypeMode: otherMode,
			endedMode
		});

		// сгруппируем как на странице театра
		const byEvent = aggregateByTitleHall(raw);
		// отсортируем по выручке по убыванию (можно поменять)
		return byEvent.sort((a: any, b: any) => (b.sales ?? 0) - (a.sales ?? 0));
	}

	$: visible = [...rowsWithDelta].sort((a, b) => {
		const va = a[sortBy] ?? -Infinity;
		const vb = b[sortBy] ?? -Infinity;
		const mul = sortDir === 'desc' ? -1 : 1;
		return va > vb ? mul : va < vb ? -mul : 0;
	});
</script>

<svelte:head>
	<title>Рейтинг театров — Театры Москвы</title>
	<meta name="description" content="Рейтинг театров Москвы по продажам и количеству билетов" />
</svelte:head>

<div class="min-h-screen bg-slate-900 text-white">
	<button class="back-to-main-btn" on:click={goToMain} aria-label="На главную">
		<ArrowLeft size={24} />
	</button>
	<header class="mx-auto w-full max-w-6xl px-6 py-8">
		<h1 class="mb-2 text-4xl font-bold">Рейтинг театров</h1>
		<p class="mb-6 text-gray-400">Сравнение по продажам, билетам и заполняемости</p>

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
					class="rounded-md px-3 py-1 text-sm font-semibold hover:bg-slate-700
          {financeYear === 2024 ? 'bg-slate-800 text-white' : 'bg-slate-600 text-gray-300'}"
					on:click={() => (financeYear = 2024 as 2024)}>2024</button
				>
				<button
					class="rounded-md px-3 py-1 text-sm font-semibold hover:bg-slate-700
          {financeYear === 2025 ? 'bg-slate-800 text-white' : 'bg-slate-600 text-gray-300'}"
					on:click={() => (financeYear = 2025 as 2025)}>2025</button
				>
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

	<!-- Таблица -->
	<main class="mx-auto w-full max-w-6xl px-6 pb-12">
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
											class="h-3 w-3 transition-transform {sortDir === 'desc' ? '' : 'rotate-180'}"
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
								<button class={thBtnClass('perSeance')} on:click={() => setSort('perSeance')}>
									на 1 сеанс
									{#if sortBy === 'perSeance'}
										<svg
											class="h-3 w-3 transition-transform {sortDir === 'desc' ? '' : 'rotate-180'}"
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
								<button class={thBtnClass('tickets')} on:click={() => setSort('tickets')}>
									Билетов
									{#if sortBy === 'tickets'}
										<svg
											class="h-3 w-3 transition-transform {sortDir === 'desc' ? '' : 'rotate-180'}"
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
								<button class={thBtnClass('avgPrice')} on:click={() => setSort('avgPrice')}>
									Средняя цена
									{#if sortBy === 'avgPrice'}
										<svg
											class="h-3 w-3 transition-transform {sortDir === 'desc' ? '' : 'rotate-180'}"
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
								<button class={thBtnClass('seances')} on:click={() => setSort('seances')}>
									Сеансов
									{#if sortBy === 'seances'}
										<svg
											class="h-3 w-3 transition-transform {sortDir === 'desc' ? '' : 'rotate-180'}"
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
								<button class={thBtnClass('occupancy')} on:click={() => setSort('occupancy')}>
									Заполняемость
									{#if sortBy === 'occupancy'}
										<svg
											class="h-3 w-3 transition-transform {sortDir === 'desc' ? '' : 'rotate-180'}"
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
								<button class={thBtnClass('share')} on:click={() => setSort('share')}>
									Доля выручки
									{#if sortBy === 'share'}
										<svg
											class="h-3 w-3 transition-transform {sortDir === 'desc' ? '' : 'rotate-180'}"
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

								<td class="py-2 pr-4">
									<a class="text-blue-300 hover:underline" href={`${base}/id/${r.id}`}>{r.name}</a>
								</td>

								<!-- Продажи -->
								<td class="py-2 pr-4">
									<div class="flex flex-col leading-tight tabular-nums">
										<span class="whitespace-nowrap">{fmtRub(r.sales)}</span>
										<span
											class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
												deltaClass(r._delta.sales)}
										>
											{fmtDeltaPct(r._delta.sales)}
										</span>
									</div>
								</td>

								<!-- на 1 сеанс -->
								<td class="py-2 pr-4">
									<div class="flex flex-col leading-tight tabular-nums">
										<span class="whitespace-nowrap">{fmtRub(r.perSeance)}</span>
										<span
											class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
												deltaClass(r._delta.perSeance)}
										>
											{fmtDeltaPct(r._delta.perSeance)}
										</span>
									</div>
								</td>

								<!-- Билетов -->
								<td class="py-2 pr-4">
									<div class="flex flex-col leading-tight tabular-nums">
										<span class="whitespace-nowrap">{fmtRub(r.tickets)}</span>
										<span
											class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
												deltaClass(r._delta.tickets)}
										>
											{fmtDeltaPct(r._delta.tickets)}
										</span>
									</div>
								</td>

								<!-- Средняя цена -->
								<td class="py-2 pr-4">
									<div class="flex flex-col leading-tight tabular-nums">
										<span class="whitespace-nowrap">{fmtRub(r.avgPrice)}</span>
										<span
											class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
												deltaClass(r._delta.avgPrice)}
										>
											{fmtDeltaPct(r._delta.avgPrice)}
										</span>
									</div>
								</td>

								<!-- Сеансов -->
								<td class="py-2 pr-4">
									<div class="flex flex-col leading-tight tabular-nums">
										<span class="whitespace-nowrap">{r.seances}</span>
										<!-- дельту сеансов можно не считать; но оставим для единообразия -->
										<span class={'mt-0.5 text-xs font-medium whitespace-nowrap ' + deltaClass(null)}
										></span>
									</div>
								</td>

								<!-- Заполняемость -->
								<td class="py-2 pr-4">
									<div class="flex flex-col leading-tight tabular-nums">
										<span class="whitespace-nowrap">{fmtPercent01(r.occupancy, 0)}</span>
										<span
											class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
												deltaClass(r._delta.occupancyPP)}
										>
											{fmtDeltaPP(r._delta.occupancyPP)}
										</span>
									</div>
								</td>

								<!-- Доля выручки -->
								<td class="py-2">
									<div class="flex flex-col leading-tight tabular-nums">
										<span class="whitespace-nowrap">{fmtPercent01(r.share, 1)}</span>
										<span
											class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
												deltaClass(r._delta.sharePP)}
										>
											{fmtDeltaPP(r._delta.sharePP)}
										</span>
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
																<td class="py-1 pr-3 text-right text-slate-400">{j + 1}</td>
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
</style>
