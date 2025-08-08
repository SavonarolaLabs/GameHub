<script lang="ts">
	/**
	 * Premiere Calendar Gantt Chart Component
	 * Props: items – array of { name, venue, startDate, endDate }
	 * startDate/endDate – strings in DD.MM.YYYY format
	 */
	interface GanttItem {
		name: string;
		venue: string;
		startDate: string;
		endDate: string;
	}
	export let items: GanttItem[] = [
		{
			name: 'Буря',
			venue: 'Основная сцена',
			startDate: '01.09.2024',
			endDate: '30.12.2024'
		},
		{
			name: 'Сделка',
			venue: 'Основная сцена',
			startDate: '15.03.2024',
			endDate: '30.11.2024'
		},
		{
			name: 'Гамлет',
			venue: 'Малая сцена',
			startDate: '01.11.2024',
			endDate: '15.04.2025'
		}
	];

	// ⇢ utilities -------------------------------------------------------------
	function parseDate(src: string): Date {
		const [d, m, y] = src.split('.').map(Number);
		return new Date(y, m - 1, d);
	}

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

	// ⇢ timeline bounds -------------------------------------------------------
	$: dates = items.flatMap((i) => [parseDate(i.startDate), parseDate(i.endDate)]);
	$: minDate = dates.length ? new Date(Math.min(...dates.map((d) => d.getTime()))) : new Date();
	$: maxDate = dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : new Date();
	$: totalDays = Math.max((maxDate.getTime() - minDate.getTime()) / 86_400_000, 1);

	// ⇢ helpers ---------------------------------------------------------------
	const pct = (date: Date) => ((date.getTime() - minDate.getTime()) / 86_400_000 / totalDays) * 100;

	// ⇢ month markers ---------------------------------------------------------
	$: monthMarkers = (() => {
		const markers = [];
		const start = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
		const end = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 1);

		let current = new Date(start);
		while (current < end) {
			const isNewYear = current.getMonth() === 0;
			const label = isNewYear
				? `${formatMonth(current)} ${current.getFullYear()}`
				: formatMonth(current);

			markers.push({
				date: new Date(current),
				label: label,
				position: pct(current),
				isNewYear: isNewYear
			});
			current.setMonth(current.getMonth() + 1);
		}
		return markers;
	})();
</script>

<!-- ⇢ markup -------------------------------------------------------------- -->
<div class="calendar-container">
	<div class="gantt-wrapper">
		<!-- Timeline header with month labels -->
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

		<!-- Gantt rows -->
		{#each items as item}
			<div class="gantt-row">
				<div class="gantt-label">
					{item.name}
				</div>

				<div class="gantt-venue">
					{item.venue}
				</div>

				<div class="gantt-track">
					{#if item.startDate && item.endDate}
						<div
							class="gantt-bar"
							style="
        left:{pct(parseDate(item.startDate))}%;
        width:{Math.max(pct(parseDate(item.endDate)) - pct(parseDate(item.startDate)), 2)}%"
						></div>

						<!-- ⭐️ маркер конца -->
						<div
							class="gantt-end"
							style="left:{pct(parseDate(item.endDate))}%"
							title="Премьера завершится"
						>
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
		top: 50%; /* по центру трека */
		transform: translate(
			-50%,
			-50%
		); /* X: чтобы центрировать символ,
                                       Y: чтобы опустить на середину */
		font-size: 2rem; /* размер звезды */
		color: #60a5fa; /* жёлтый (можете заменить) */
		pointer-events: none; /* чтобы не мешала hover-эффектам */

		/* при желании лёгкая тень: */
		text-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
	}

	/* Responsive adjustments */
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
