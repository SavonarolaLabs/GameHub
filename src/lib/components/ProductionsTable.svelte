<script lang="ts">
	import { fmtRub, fmtPercent01, fmtDeltaPct, fmtDeltaPP, deltaClass } from '$lib/utils/format';

	export let rowsSorted: any[] = [];
	export let sessionsForEvent: (e: { title: string; hall: string }) => any[];

	type SortKey =
		| 'sales'
		| 'salesPerShow'
		| 'tickets'
		| 'avgPrice'
		| 'seances'
		| 'occupancy'
		| 'share';
	export let sortBy: SortKey = 'sales';
	export let sortDir: 'desc' | 'asc' = 'desc';

	let expandedDetail = new Set<string>();
	const detailKey = (e: { title: string; hall: string }) => `${e.title}__${e.hall}`;

	function toggleDetail(key: string) {
		const next = new Set(expandedDetail);
		if (next.has(key)) next.delete(key);
		else next.add(key);
		expandedDetail = next;
	}

	const thBtnClass = (k: SortKey) =>
		`flex items-center gap-1 hover:underline ${sortBy === k ? 'text-blue-400' : ''}`;
</script>

<div class="-mx-6 md:mx-0">
	<div class="overflow-x-auto overscroll-x-contain">
		<table class="w-full min-w-[80rem] text-left">
			<thead class="border-b border-slate-700 text-gray-400">
				<tr>
					<th class="py-2 pr-3 text-right">№</th>
					<th class="py-2 pr-4">Название</th>
					<th class="py-2 pr-4">Сцена</th>

					<th class="py-2 pr-4">
						<button class={thBtnClass('sales')}>Продажи</button>
					</th>

					<th class="py-2 pr-4">
						<button class={thBtnClass('salesPerShow')}>на 1 показ</button>
					</th>

					<th class="py-2 pr-4">
						<button class={thBtnClass('tickets')}>Билетов</button>
					</th>

					<th class="py-2 pr-4">
						<button class={thBtnClass('avgPrice')}>Цена</button>
					</th>

					<th class="py-2 pr-4">
						<button class={thBtnClass('seances')}>Сеансов</button>
					</th>

					<th class="py-2 pr-4">
						<button class={thBtnClass('occupancy')}>Загрузка</button>
					</th>

					<th class="py-2"><button class={thBtnClass('share')}>Доля выручки</button></th>
				</tr>
			</thead>

			<tbody>
				{#each rowsSorted as e, i (e.title + '__' + e.hall)}
					<tr class="border-b border-slate-800 align-top last:border-none">
						<td class="py-2 pr-3 text-right align-top text-slate-400 tabular-nums">
							<button
								class="inline-flex items-center gap-1 text-slate-300 hover:text-white"
								onclick={() => toggleDetail(detailKey(e))}
								aria-expanded={expandedDetail.has(detailKey(e))}
								aria-label="Показать сеансы"
							>
								<span>{i + 1}</span>
								<svg
									class={'h-3 w-3 transition-transform ' +
										(expandedDetail.has(detailKey(e)) ? 'rotate-180' : '')}
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

						<td class="w-[22ch] min-w-0 py-2 pr-4 align-top sm:w-[28ch] md:w-[32ch]">
							<div
								class="clamp-2 max-w-full leading-snug break-words whitespace-normal"
								title={e.title}
							>
								{e.title}
							</div>
						</td>

						<td class="w-[16ch] py-2 pr-4 align-top break-words whitespace-normal sm:w-[18ch]"
							>{e.hall}</td
						>

						<td class="py-2 pr-4 align-top">
							<div class="flex flex-col leading-tight tabular-nums">
								<span class="whitespace-nowrap">{fmtRub(Math.round(e.sales))}</span>
								<span
									class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
										deltaClass(e._delta.sales)}>{fmtDeltaPct(e._delta.sales)}</span
								>
							</div>
						</td>

						<td class="py-2 pr-4 align-top">
							<div class="flex flex-col leading-tight tabular-nums">
								<span class="whitespace-nowrap">{fmtRub(Math.round(e.salesPerShow))}</span>
								<span
									class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
										deltaClass(e._delta.perShow)}>{fmtDeltaPct(e._delta.perShow)}</span
								>
							</div>
						</td>

						<td class="py-2 pr-4 align-top">
							<div class="flex flex-col leading-tight tabular-nums">
								<span class="whitespace-nowrap">{fmtRub(Math.round(e.tickets))}</span>
								<span
									class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
										deltaClass(e._delta.tickets)}>{fmtDeltaPct(e._delta.tickets)}</span
								>
							</div>
						</td>

						<td class="py-2 pr-4 align-top">
							<div class="flex flex-col leading-tight tabular-nums">
								<span class="whitespace-nowrap">{fmtRub(Math.round(e.avgPrice || 0))}</span>
								<span
									class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
										deltaClass(e._delta.avgPrice)}>{fmtDeltaPct(e._delta.avgPrice)}</span
								>
							</div>
						</td>

						<td class="py-2 pr-4 align-top">
							<div class="flex flex-col leading-tight tabular-nums">
								<span class="whitespace-nowrap">{e.seances}</span>
								<span
									class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
										deltaClass(e._delta.seances)}>{fmtDeltaPct(e._delta.seances)}</span
								>
							</div>
						</td>

						<td class="py-2 pr-4 align-top">
							<div class="flex flex-col leading-tight tabular-nums">
								<span class="whitespace-nowrap">{Math.round((e.occupancy ?? 0) * 100)}%</span>
								<span
									class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
										deltaClass(e._delta.occupancyPP)}>{fmtDeltaPP(e._delta.occupancyPP)}</span
								>
							</div>
						</td>

						<td class="py-2 align-top">
							<div class="flex flex-col leading-tight tabular-nums">
								<span class="whitespace-nowrap">{Math.round((e.share ?? 0) * 100)}%</span>
								<span
									class={'mt-0.5 text-xs font-medium whitespace-nowrap ' +
										deltaClass(e._delta.sharePP)}>{fmtDeltaPP(e._delta.sharePP)}</span
								>
							</div>
						</td>
					</tr>

					{#if expandedDetail.has(detailKey(e))}
						<tr class="bg-slate-800/60">
							<td colspan="10" class="p-0">
								<div class="px-4 pt-1 pb-3">
									<div class="overflow-x-auto">
										<table class="w-full min-w-[60rem] text-left text-xs sm:text-sm">
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
												{#each sessionsForEvent(e) as s, k}
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

<style>
	.clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
