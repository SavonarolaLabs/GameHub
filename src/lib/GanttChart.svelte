<script lang="ts">
	/**
	 * Simple Gantt‑chart component for Svelte + Tailwind
	 * Props: items – array of { name, venue, startDate, endDate }
	 * startDate/endDate – strings in DD.MM.YYYY format
	 */
	interface GanttItem {
		name: string;
		venue: string;
		startDate: string;
		endDate: string;
	}
	export let items: GanttItem[] = [];

	// ⇢ utilities -------------------------------------------------------------
	function parseDate(src: string): Date {
		const [d, m, y] = src.split('.').map(Number);
		return new Date(y, m - 1, d);
	}

	// ⇢ timeline bounds -------------------------------------------------------
	$: dates = items.flatMap((i) => [parseDate(i.startDate), parseDate(i.endDate)]);
	$: minDate = dates.length ? new Date(Math.min(...dates.map((d) => d.getTime()))) : new Date();
	$: maxDate = dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : new Date();
	$: totalDays = (maxDate.getTime() - minDate.getTime()) / 86_400_000 || 1;

	// ⇢ helpers ---------------------------------------------------------------
	const pct = (date: Date) => ((date.getTime() - minDate.getTime()) / 86_400_000 / totalDays) * 100;
</script>

<!-- ⇢ markup -------------------------------------------------------------- -->
<div class="overflow-x-auto pb-4">
	{#each items as item}
		<div class="gantt-row">
			<div class="gantt-label text-sm">
				{item.name} <span class="text-gray-400">/ {item.venue}</span>
			</div>

			<div class="gantt-track">
				{#if item.startDate && item.endDate}
					<div
						class="gantt-bar"
						style="left:{pct(parseDate(item.startDate))}%; width:{Math.max(
							pct(parseDate(item.endDate)) - pct(parseDate(item.startDate)),
							0.5
						)}%"
					></div>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	/* fallback for projects without Tailwind */
	:global(.gantt-row) {
		margin-bottom: 0.75rem;
		display: flex;
		align-items: center;
	}
	:global(.gantt-label) {
		width: 15rem;
		flex-shrink: 0;
		padding-right: 1rem;
		font-weight: 500;
		white-space: nowrap;
	}
	:global(.gantt-track) {
		position: relative;
		flex: 1;
		height: 2rem;
		border-radius: 0.5rem;
		background: #334155; /* slate‑700 */
	}
	:global(.gantt-bar) {
		position: absolute;
		top: 0;
		height: 100%;
		border-radius: 0.5rem;
		background: #ec4899; /* pink‑500 */
	}
</style>
