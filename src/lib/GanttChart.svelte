<script lang="ts">
	/**
	 * Premiere Calendar Gantt Chart Component
	 * Props:
	 *  - items – [{ name, venue, startDate, endDate }] (DD.MM.YYYY)
	 *  - showToggle – показывать ли чекбокс «от сегодняшнего дня»
	 *  - defaultFromToday – начальное состояние чекбокса
	 */
	interface GanttItem {
		name: string;
		venue: string;
		startDate: string;
		endDate: string;
	}

	export let items: GanttItem[] = [];
	export let showToggle = true;
	export let defaultFromToday = false;

	let fromToday = defaultFromToday;

	// demo-заглушка, если items не переданы
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

	const monthKey = (d: Date) => d.getFullYear() * 12 + d.getMonth(); // для сравнения месяцев
	const maxMonth = (a: Date, b: Date) => (monthKey(a) >= monthKey(b) ? a : b);

	function formatMonth(date: Date): string {
		const months = [
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
		return months[date.getMonth()];
	}

	// ------------- исходные границы по данным -------------
	$: allDates = items.flatMap((i) => [parseDate(i.startDate), parseDate(i.endDate)]);
	$: rawMin = allDates.length
		? new Date(Math.min(...allDates.map((d) => d.getTime())))
		: new Date();
	$: rawMax = allDates.length
		? new Date(Math.max(...allDates.map((d) => d.getTime())))
		: new Date();

	// ------------- вычисление видимого диапазона -------------
	// 2 режима:
	//  • auto (fromToday = false): по данным, но с подушкой: -1 месяц слева и +1 месяц справа
	//  • fromToday (true): от текущего месяца и минимум 3 месяца (текущий + 2 следующих),
	//                      но если данные выходят дальше — расширяем вправо, + ничего лишнего слева
	$: {
		const today = new Date();
		const todayMonth = firstOfMonth(today);

		// auto-границы в «месяцах» с подушкой
		const dataStartMonth = firstOfMonth(rawMin);
		const dataEndMonth = firstOfMonth(rawMax);
		const autoStartMonth = addMonths(dataStartMonth, -1);
		const autoEndMonth = addMonths(dataEndMonth, +1);

		// from-today-границы
		// как минимум: current, +1, +2 -> итого 3 месяца.
		const minEndForToday = addMonths(todayMonth, +2);
		const fromTodayStartMonth = todayMonth;
		const fromTodayEndMonth = maxMonth(firstOfMonth(rawMax), minEndForToday);

		// финальные месяцы диапазона
		rangeStartMonth = fromToday ? fromTodayStartMonth : autoStartMonth;
		rangeEndMonth = fromToday ? fromTodayEndMonth : autoEndMonth;
	}

	// сами даты границ (для рассчёта процентов)
	let rangeStartMonth: Date;
	let rangeEndMonth: Date;

	$: minDate = firstOfMonth(rangeStartMonth);
	$: maxDate = endOfMonth(rangeEndMonth); // включительно до конца месяца
	$: totalDays = Math.max(1, Math.ceil((maxDate.getTime() - minDate.getTime()) / msInDay));

	const clampDate = (d: Date) => (d < minDate ? minDate : d > maxDate ? maxDate : d);

	const pct = (date: Date) => ((date.getTime() - minDate.getTime()) / msInDay / totalDays) * 100;

	// ------------- month markers -------------
	// ------------- month markers -------------
	$: monthMarkers = (() => {
		const out: { date: Date; label: string; position: number; isNewYear: boolean }[] = [];
		const start = firstOfMonth(rangeStartMonth);
		const endExclusive = addMonths(firstOfMonth(rangeEndMonth), 1);

		let current = new Date(start);
		while (current < endExclusive) {
			const isFirst =
				current.getFullYear() === start.getFullYear() && current.getMonth() === start.getMonth();
			const isNewYear = current.getMonth() === 0; // январь
			const showYear = isFirst || isNewYear;

			const label = showYear
				? `${formatMonth(current)} ${current.getFullYear()}`
				: formatMonth(current);

			out.push({
				date: new Date(current),
				label,
				position: pct(current),
				isNewYear
			});

			current = addMonths(current, 1);
		}
		return out;
	})();

	// ------------- позиции/ширины для баров (с учётом обрезки на границах) -------------
	function barStyle(start: string, end: string) {
		const s = clampDate(parseDate(start));
		const e = clampDate(parseDate(end));
		const left = pct(s);
		const width = Math.max(pct(e) - left, 2); // хоть какая-то видимая ширина
		return `left:${left}%;width:${width}%`;
	}

	function endMarkerLeft(end: string) {
		return `left:${pct(clampDate(parseDate(end)))}%`;
	}
</script>

<!-- markup -->
<div class="calendar-container">
	<div class="gantt-wrapper">
		<!-- Панель параметров -->
		{#if showToggle}
			<div class="controls">
				<label class="toggle">
					<input type="checkbox" bind:checked={fromToday} />
					<span>Показывать от сегодняшнего дня</span>
				</label>
			</div>
		{/if}

		<!-- Заголовок с месяцами -->
		<div class="timeline-header">
			<div class="label-spacer"></div>
			<div class="venue-spacer"></div>
			<div class="timeline-months">
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

		<!-- Ряды Gantt -->
		{#each items as item}
			<div class="gantt-row">
				<div class="gantt-label">{item.name}</div>
				<div class="gantt-venue">{item.venue}</div>
				<div class="gantt-track">
					{#if item.startDate && item.endDate}
						<div class="gantt-bar" style={barStyle(item.startDate, item.endDate)}></div>
						<div class="gantt-end" style={endMarkerLeft(item.endDate)} title="Премьера завершится">
							★
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
	}
	.month-label.new-year {
		color: #f03066;
		font-weight: 600;
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
	.gantt-track {
		position: relative;
		flex: 1;
		height: 2rem;
		border-radius: 1rem;
		background: #4b5563;
		border: 1px solid #6b7280;
	}
	.gantt-bar {
		position: absolute;
		top: 0;
		height: 100%;
		border-radius: 1rem;
		background: linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease;
	}
	.gantt-bar:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}
	.gantt-end {
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		font-size: 2rem;
		color: #60a5fa;
		pointer-events: none;
		text-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
	}

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
