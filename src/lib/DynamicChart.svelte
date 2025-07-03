<script lang="ts">
	/**
	 * Лайтовый компонент графика (Chart.js) для отображения динамики выручки и посещаемости
	 * Props: data – массив объектов { year, month, revenue, tickets }
	 * Требует зависимостей:   npm i chart.js
	 */
	import { onMount, onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';

	interface DynamicPoint {
		year: number;
		month: number; // 1–12
		revenue: number;
		tickets: number;
	}
	export let data: DynamicPoint[] = [];

	// ⇢ подготовка данных -----------------------------------------------------
	const MONTHS_RU = [
		'Январь',
		'Февраль',
		'Март',
		'Апрель',
		'Май',
		'Июнь',
		'Июль',
		'Август',
		'Сентябрь',
		'Октябрь',
		'Ноябрь',
		'Декабрь'
	];
	$: labels = data.map((d) => `${MONTHS_RU[d.month - 1].slice(0, 3)} ${String(d.year).slice(2)}`);
	$: revenueSeries = data.map((d) => d.revenue);
	$: ticketsSeries = data.map((d) => d.tickets);

	// ⇢ Chart.js -------------------------------------------------------------
	let canvasEl: HTMLCanvasElement;
	let chart: Chart;

	onMount(() => {
		if (!canvasEl) return;
		chart = new Chart(canvasEl, {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
						label: 'Выручка, ₽',
						data: revenueSeries,
						borderWidth: 2,
						tension: 0.2,
						yAxisID: 'y',
						pointRadius: 3
					},
					{
						label: 'Билеты, шт',
						data: ticketsSeries,
						borderWidth: 2,
						tension: 0.2,
						yAxisID: 'y1',
						pointRadius: 3
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				interaction: {
					mode: 'index',
					intersect: false
				},
				scales: {
					y: {
						type: 'linear',
						position: 'left',
						ticks: {
							callback: (v: number) => v.toLocaleString()
						}
					},
					y1: {
						type: 'linear',
						position: 'right',
						grid: { drawOnChartArea: false },
						ticks: {
							callback: (v: number) => v.toLocaleString()
						}
					}
				},
				plugins: {
					tooltip: {
						callbacks: {
							label: (ctx) => `${ctx.dataset.label}: ${Number(ctx.parsed.y).toLocaleString()}`
						}
					}
				}
			}
		});
	});

	onDestroy(() => chart && chart.destroy());
</script>

<div class="p-4; h-[300px] w-full rounded-lg bg-slate-800">
	<canvas bind:this={canvasEl}></canvas>
</div>

<style>
</style>
