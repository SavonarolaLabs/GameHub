<script lang="ts">
	/**
	 * Premiere Calendar — tracks (empty), month header, star on end date, "today" line.
	 * Props:
	 *  - items – [{ name, venue, startDate, endDate }] (DD.MM.YYYY)
	 *  - showToggle – показывать чекбокс «от сегодняшнего дня»
	 *  - defaultFromToday – начальное состояние чекбокса (по умолчанию true)
	 *  - showTodayToggle – показывать чекбокс «линия сегодня»
	 *  - defaultShowToday – начальное состояние линии «сегодня» (по умолчанию true)
	 */
	interface GanttItem {
		name: string;
		venue: string;
		startDate: string;
		endDate: string;
	}

	export let items: GanttItem[] = [];
	export let showToggle = true;
	export let defaultFromToday = true;

	export let showTodayToggle = true;
	export let defaultShowToday = true;

	let fromToday = defaultFromToday;
	let showToday = defaultShowToday;

	// demo, если items не переданы
	if (!items.length) {
		items = [
			{ name: 'Буря', venue: 'Основная сцена', startDate: '01.09.2024', endDate: '30.12.2024' },
			{ name: 'Сделка', venue: 'Основная сцена', startDate: '15.03.2024', endDate: '30.11.2024' },
			{ name: 'Гамлет', venue: 'Малая сцена', startDate: '01.11.2024', endDate: '15.04.2025' }
		];
	}

	// ---------------- utilities ----------------
	function parseDate(src: string): Date {
		const [d, m, y] = src.split('.').map(Number);
		return new Date(y, (m ?? 1) - 1, d ?? 1);
	}
	const msInDay = 86_400_000;

	const firstOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
	const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
	const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);

	const monthKey = (d: Date) => d.getFullYear() * 12 + d.getMonth();
	const maxMonth = (a: Date, b: Date) => (monthKey(a) >= monthKey(b) ? a : b);

	const monthsRu = [
		'январь',
		'февраль',
		'март',
		'апрель',
		'май',
		'июнь',
		'июль',
		'август',
		'сентябрь',
		'октябрь',
		'ноябрь',
		'декабрь'
	];
	const formatMonth = (d: Date) => monthsRu[d.getMonth()];

	// прошедшие даты — серые (дата окончания)
	const today0 = new Date();
	today0.setHours(0, 0, 0, 0);
	const isPast = (dateStr: string) => parseDate(dateStr).getTime() < today0.getTime();

	// ------------- исходные границы по данным -------------
	$: allDates = items.flatMap((i) => [parseDate(i.startDate), parseDate(i.endDate)]);
	$: rawMin = allDates.length
		? new Date(Math.min(...allDates.map((d) => d.getTime())))
		: new Date();
	$: rawMax = allDates.length
		? new Date(Math.max(...allDates.map((d) => d.getTime())))
		: new Date();

	// ------------- вычисление видимого диапазона -------------
	//  • auto (fromToday = false): по данным, с подушкой: -1 мес слева и +1 мес справа (минимум 3 мес)
	//  • fromToday (true): от текущего месяца и минимум 3 мес (текущий + 2 следующих),
	//                      но если данные уходят дальше — расширяем вправо
	let rangeStartMonth: Date;
	let rangeEndMonth: Date;

	$: {
		const today = new Date();
		const todayMonth = firstOfMonth(today);

		// auto
		const dataStartMonth = firstOfMonth(rawMin);
		const dataEndMonth = firstOfMonth(rawMax);
		const autoStartMonth = addMonths(dataStartMonth, -1);
		const autoEndMonth = addMonths(dataEndMonth, +1);

		// from-today
		const minEndForToday = addMonths(todayMonth, +2); // минимум 3 месяца
		const fromTodayStartM = todayMonth;
		const fromTodayEndM = maxMonth(firstOfMonth(rawMax), minEndForToday);

		rangeStartMonth = fromToday ? fromTodayStartM : autoStartMonth;
		rangeEndMonth = fromToday ? fromTodayEndM : autoEndMonth;

		// гарантируем минимум 3 месяца и в auto-режиме:
		const monthsSpan = monthKey(rangeEndMonth) - monthKey(rangeStartMonth) + 1;
		if (monthsSpan < 3) {
			rangeEndMonth = addMonths(rangeStartMonth, 2);
		}
	}

	// сами даты границ (для процентов)
	$: minDate = firstOfMonth(rangeStartMonth);
	$: maxDate = endOfMonth(rangeEndMonth);
	$: totalDays = Math.max(1, Math.ceil((maxDate.getTime() - minDate.getTime()) / msInDay));

	const clampDate = (d: Date) => (d < minDate ? minDate : d > maxDate ? maxDate : d);
	const pct = (date: Date) => ((date.getTime() - minDate.getTime()) / msInDay / totalDays) * 100;

	// ------------- month markers (с годом у первого и у января) -------------
	type MonthMarker = { date: Date; label: string; position: number; isNewYear: boolean };
	$: monthMarkers = (() => {
		const out: MonthMarker[] = [];
		const start = firstOfMonth(rangeStartMonth);
		const endExclusive = addMonths(firstOfMonth(rangeEndMonth), 1);

		let current = new Date(start);
		let index = 0;
		while (current < endExclusive) {
			const isJan = current.getMonth() === 0;
			const label =
				index === 0 || isJan
					? `${formatMonth(current)} ${current.getFullYear()}`
					: formatMonth(current);

			out.push({
				date: new Date(current),
				label,
				position: pct(current),
				isNewYear: isJan
			});
			current = addMonths(current, 1);
			index++;
		}
		return out;
	})();

	// позиция звезды (по дате окончания)
	function endMarkerLeft(end: string) {
		return `left:${pct(clampDate(parseDate(end)))}%`;
	}

	// позиция линии «сегодня» (если сегодня в диапазоне)
	$: todayInRange = today0 >= minDate && today0 <= maxDate;
	function todayLeft() {
		return `left:${pct(today0)}%`;
	}
</script>

<!-- markup -->
<div class="calendar-container">
	<div class="gantt-wrapper">
		{#if showToggle || showTodayToggle}
			<div class="controls">
				{#if showToggle}
					<label class="toggle">
						<input type="checkbox" bind:checked={fromToday} />
						<span>Показывать от сегодняшнего дня</span>
					</label>
				{/if}
				{#if showTodayToggle}
					<label class="toggle">
						<input type="checkbox" bind:checked={showToday} />
						<span>Линия «сегодня»</span>
					</label>
				{/if}
			</div>
		{/if}

		<!-- Заголовок с месяцами -->
		<div class="timeline-header">
			<div class="label-spacer"></div>
			<div class="venue-spacer"></div>
			<div class="timeline-months">
				{#if showToday && todayInRange}
					<div class="today-line" style={todayLeft()} title="Сегодня"></div>
				{/if}
				{#each monthMarkers as marker}
					<div
						class="month-label"
						class:new-year={marker.isNewYear}
						style="left: {marker.position}%"
					>
						{marker.label}
					</div>
				{/each}
			</div>
		</div>

		<!-- Ряды (дорожка без заполнения, только звезда + дата + линия сегодня) -->
		{#each items as item}
			<div class="gantt-row">
				<div class="gantt-label">{item.name}</div>
				<div class="gantt-venue">{item.venue}</div>

				<div class="gantt-track">
					{#if showToday && todayInRange}
						<div class="today-line" style={todayLeft()} title="Сегодня"></div>
					{/if}

					{#if item.startDate && item.endDate}
						<!-- звезда -->
						<div
							class="gantt-end {isPast(item.endDate) ? 'past' : ''}"
							style={endMarkerLeft(item.endDate)}
							title="Премьера завершится"
						>
							★
						</div>

						<!-- подпись даты -->
						<div
							class="marker-label {isPast(item.endDate) ? 'past' : ''}"
							style={endMarkerLeft(item.endDate)}
						>
							{item.endDate}
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.calendar-container {
		color: white;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}
	.gantt-wrapper {
		background: #374151;
		border-radius: 0.75rem;
		padding: 1.5rem;
		overflow-x: auto;
		min-width: 800px;
	}

	.controls {
		display: flex;
		align-items: center;
		margin-bottom: 0.5rem;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		color: #e5e7eb;
		user-select: none;
	}
	.toggle input {
		accent-color: #60a5fa;
	}

	.timeline-header {
		display: flex;
		align-items: center;
		margin-bottom: 1rem;
		height: 2rem;
		position: relative;
		z-index: 0;
	}
	.label-spacer {
		width: 8rem;
		flex-shrink: 0;
	}
	.venue-spacer {
		width: 12rem;
		flex-shrink: 0;
	}

	.timeline-months {
		flex: 1;
		position: relative;
		height: 100%;
	}
	.month-label {
		position: absolute;
		top: 0;
		font-size: 0.875rem;
		color: #d1d5db;
		white-space: nowrap;
		transform: translateX(-50%);
		z-index: 2;
	}
	.month-label.new-year {
		color: #f03066;
		font-weight: 600;
	}

	/* линия «сегодня» (и в шапке, и в дорожке) */
	.today-line {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 2px;
		background: #f8fafc; /* почти белая */
		opacity: 0.85;
		transform: translateX(-50%);
		pointer-events: none;
		z-index: 1;
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05);
	}

	.gantt-row {
		display: flex;
		align-items: center;
		margin-bottom: 1rem;
		min-height: 3rem;
	}
	.gantt-label {
		width: 8rem;
		flex-shrink: 0;
		padding-right: 1rem;
		font-weight: 500;
		font-size: 1.125rem;
		white-space: normal;
	}
	.gantt-venue {
		width: 12rem;
		flex-shrink: 0;
		padding-right: 1rem;
		color: #d1d5db;
		font-size: 0.875rem;
		white-space: nowrap;
	}

	/* трек без заполнения (только фон/граница для ориентира) */
	.gantt-track {
		position: relative;
		flex: 1;
		height: 2rem;
		border-radius: 1rem;
		background: #4b5563;
		border: 1px solid #6b7280;
		overflow: hidden;
	}

	/* звезда */
	.gantt-end {
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		font-size: 1.75rem;
		color: #60a5fa; /* синий */
		pointer-events: none;
		text-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
		z-index: 2;
	}
	.gantt-end.past {
		color: #9ca3af;
	} /* прошедшие — серые */

	/* подпись даты над звездой */
	.marker-label {
		position: absolute;
		top: -0.1rem;
		transform: translateX(-50%) translateY(-100%);
		font-size: 0.8rem;
		color: #e5e7eb;
		white-space: nowrap;
		pointer-events: none;
		z-index: 2;
	}
	.marker-label.past {
		color: #9ca3af;
	} /* прошедшие — серые */

	@media (max-width: 768px) {
		.calendar-container {
			padding: 1rem;
		}
		.gantt-label {
			width: 6rem;
			font-size: 1rem;
		}
		.gantt-venue {
			width: 8rem;
			font-size: 0.75rem;
		}
	}
</style>
