<script lang="ts">
	/**
	 * items = [{ label, percent, value?, avg?, color? }]
	 *  percent — ширина бара (0–1  или  0–100)
	 *  avg     — позиция маркера «среднее» (та же шкала, опционально)
	 *  value   — что показать справа (обработаете сами, напр. млн ₽ или %)
	 */
	interface BarItem {
		label: string;
		percent: number; // 0…1  или 0…100
		value?: string | number; // «517 млн ₽»
		avg?: number; // 0…1? ➟ где маркер
		avgPct?: number; // 0…1  или 0…100   — текст «среднее %» (если нужен)
	}
	export let items: BarItem[] = [];

	// принимаем и 0-100, и 0-1 — приводим к 0-100
	const toPct = (n: number) => (n > 1 ? n : n * 100);
</script>

<div class="bar-chart">
	{#each items as i}
		<div class="bar-row">
			<div class="bar-label">{i.label}</div>

			<div class="bar-track">
				<!-- основной сегмент -->
				<div
					class="bar-fill"
					style="width:{toPct(i.percent)}%; background:{i.color ?? '#3B82F6'}"
				></div>

				{#if i.avg != null}
					<!-- маркер среднего -->
					<div
						class="avg-line"
						style="left:{toPct(i.avg)}%"
						title={`Среднее: ${i.avg * (i.avg > 1 ? 1 : 100)}%`}
					></div>
				{/if}
			</div>

			<div class="bar-value">
				{#if i.value != null}
					{i.value}
					{#if i.percent > 0}
						&nbsp;{Math.round(toPct(i.percent))}%
					{/if}
					{#if i.avgPct != null}
						&nbsp;/&nbsp;{Math.round(toPct(i.avgPct))}%
					{/if}
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	.bar-chart {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
	}
	.bar-row {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.bar-label {
		width: 10rem;
		flex-shrink: 0;
		font-weight: 500;
		white-space: nowrap;
	}
	.bar-track {
		position: relative;
		flex: 1;
		height: 1.5rem;
		border-radius: 0.75rem;
		background: #4b5563;
	}
	.bar-fill {
		position: absolute;
		inset: 0;
		border-radius: 0.75rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
		transition: width 0.25s;
	}

	/* тонкая полоска «среднее» */
	.avg-line {
		position: absolute;
		top: -3px;
		bottom: -3px;
		width: 3px; /* если что ширину - вот тут поменять можно будет */
		background: #ffffff;
		opacity: 0.9;
		pointer-events: none;
	}

	.bar-value {
		width: 8rem;
		flex-shrink: 0;
		text-align: right;
		white-space: nowrap;
	}
</style>
