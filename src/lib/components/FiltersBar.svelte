<script lang="ts">
	export let groupMode: 'year' | 'season' = 'year';
	export let financeYear: 2024 | 2025 = 2024;
	export let availableSeasons: number[] = [];
	export let selectedSeason: number | null = null;
	export let onlyMainStage = true;
	export let otherMode: 'exclude' | 'include' | 'only' = 'exclude';
	export let endedMode: 'all' | 'active' | 'ended' = 'all';
</script>

<div class="mt-4 mb-6 flex flex-wrap items-center gap-4">
	<label class="flex items-center gap-2">
		<span class="text-gray-400">Группировка:</span>
		<select bind:value={groupMode} class="rounded bg-slate-700 px-2 py-1">
			<option value="year">по году</option>
			<option value="season">по сезону</option>
		</select>
	</label>

	{#if groupMode === 'year'}
		<button
			class="rounded-md px-3 py-1 text-sm font-semibold hover:bg-slate-700 {financeYear === 2024
				? 'bg-slate-800 text-white'
				: 'bg-slate-600 text-gray-300'}"
			onclick={() => (financeYear = 2024)}>2024</button
		>
		<button
			class="rounded-md px-3 py-1 text-sm font-semibold hover:bg-slate-700 {financeYear === 2025
				? 'bg-slate-800 text-white'
				: 'bg-slate-600 text-gray-300'}"
			onclick={() => (financeYear = 2025)}>2025</button
		>
	{:else}
		<label class="flex items-center gap-2">
			<span class="text-gray-400">Сезон:</span>
			<select bind:value={selectedSeason} class="rounded bg-slate-700 px-2 py-1">
				{#each availableSeasons as s}
					<option value={s}>{s}</option>
				{/each}
			</select>
		</label>
	{/if}

	<label class="ml-4 flex items-center gap-2">
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
