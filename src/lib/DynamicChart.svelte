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
						borderColor: '#10b981',
						backgroundColor: 'rgba(16, 185, 129, 0.1)',
						borderWidth: 2,
						tension: 0.3,
						yAxisID: 'y',
						pointRadius: 3,
						pointHoverRadius: 5,
						pointBackgroundColor: '#10b981',
						pointBorderColor: '#065f46',
						pointBorderWidth: 2,
						fill: true
					},
					{
						label: 'Билеты, шт',
						data: ticketsSeries,
						borderColor: '#8b5cf6',
						backgroundColor: 'rgba(139, 92, 246, 0.1)',
						borderWidth: 2,
						tension: 0.3,
						yAxisID: 'y1',
						pointRadius: 3,
						pointHoverRadius: 5,
						pointBackgroundColor: '#8b5cf6',
						pointBorderColor: '#5b21b6',
						pointBorderWidth: 2,
						fill: true
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
				plugins: {
					legend: {
						labels: {
							color: '#e5e7eb', // gray-200
							font: {
								size: 14,
								weight: '500'
							},
							padding: 20,
							usePointStyle: true,
							pointStyle: 'circle'
						}
					},
					tooltip: {
						backgroundColor: 'rgba(30, 41, 59, 0.95)', // slate-800 with opacity
						titleColor: '#f1f5f9', // slate-100
						bodyColor: '#e2e8f0', // slate-200
						borderColor: '#475569', // slate-600
						borderWidth: 1,
						cornerRadius: 8,
						padding: 12,
						callbacks: {
							label: (ctx) => `${ctx.dataset.label}: ${Number(ctx.parsed.y).toLocaleString()}`
						}
					}
				},
				scales: {
					x: {
						grid: {
							color: 'rgba(71, 85, 105, 0.3)', // slate-600 with opacity
							drawBorder: false
						},
						ticks: {
							color: '#cbd5e1', // slate-300
							font: {
								size: 12
							}
						}
					},
					y: {
						type: 'linear',
						position: 'left',
						grid: {
							color: 'rgba(71, 85, 105, 0.3)', // slate-600 with opacity
							drawBorder: false
						},
						ticks: {
							color: '#cbd5e1', // slate-300
							font: {
								size: 12
							},
							callback: (v: number) => v.toLocaleString()
						},
						title: {
							display: false
						}
					},
					y1: {
						type: 'linear',
						position: 'right',
						grid: {
							drawOnChartArea: false,
							color: 'rgba(71, 85, 105, 0.3)',
							drawBorder: false
						},
						ticks: {
							color: '#cbd5e1', // slate-300
							font: {
								size: 12
							},
							callback: (v: number) => v.toLocaleString()
						},
						title: {
							display: false
						}
					}
				}
			}
		});
	});

	onDestroy(() => chart && chart.destroy());
</script>

<div class="chart-container">
	<canvas bind:this={canvasEl}></canvas>
</div>

<style>
	.chart-container {
		padding: 1.5rem;
		height: 350px;
		width: 100%;
		background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
		border-radius: 12px;
		border: 1px solid rgba(71, 85, 105, 0.3);
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06);
		position: relative;
		overflow: hidden;
	}

	.chart-container::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(16, 185, 129, 0.4),
			rgba(139, 92, 246, 0.4),
			transparent
		);
	}
</style>
