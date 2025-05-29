<script lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { theaters } from '$lib/theaters-data';

	/* ---------------- helpers ---------------- */
	let searchQuery = '';
	let filteredTheaters: Theater[] = theaters;

	const norm = (v: unknown) => String(v ?? '').toLowerCase();
	const seats = (t: Theater) => t.spaces.reduce((s, v) => s + (v.total_capacity ?? 0), 0);
	const dir = (t: Theater) =>
		t.hr.find((h) => h.position.trim().toLowerCase().startsWith('директор'))?.full_name ?? '—';
	const artDir = (t: Theater) =>
		t.hr.find((h) => h.position.trim().toLowerCase().includes('художественный'))?.full_name ?? '—';
	const img = (file: string) => `${base}/theaters/${file}.jpg`;

	function filter() {
		if (searchQuery.trim() === '') {
			filteredTheaters = theaters;
			return;
		}

		const q = norm(searchQuery);
		filteredTheaters = theaters.filter((t) =>
			[
				t.name,
				t.address,
				...t.spaces.map((s) => s.venue_space_short_name),
				...t.productions.map((p) => p.name)
			]
				.map(norm)
				.some((v) => v.includes(q))
		);
	}

	function navigate(id: number) {
		goto(`${base}/id/${id}`);
	}

	function handleKey(event: KeyboardEvent, id: number) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			navigate(id);
		}
	}

	$: filter();
</script>

<svelte:head>
	<title>Театры Москвы — Справочник</title>
	<meta
		name="description"
		content="Справочник театров Москвы с рейтингами, спектаклями и адресами"
	/>
</svelte:head>

<div class="min-h-screen bg-slate-900">
	<!-- header -->
	<div class="flex w-full justify-center bg-gradient-to-b from-slate-800 to-slate-900">
		<header class="w-full max-w-6xl px-6 py-12 text-center text-white">
			<h1 class="mb-4 text-5xl font-bold">Театры Москвы</h1>
			<p class="mb-8 text-xl text-gray-300">Справочник театров Москвы</p>

			<!-- search -->
			<div class="relative mx-auto mb-8 max-w-2xl">
				<input
					class="w-full rounded-lg bg-slate-700 px-6 py-4 text-lg text-white placeholder-gray-400 transition-all duration-300 focus:bg-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					type="text"
					bind:value={searchQuery}
					placeholder="Поиск театров…"
					on:input={filter}
				/>
				<svg
					class="absolute top-1/2 right-4 h-6 w-6 -translate-y-1/2 text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
		</header>
	</div>

	<!-- grid -->
	<div class="flex w-full justify-center bg-slate-900">
		<main class="w-full max-w-6xl px-6 py-8">
			{#if filteredTheaters.length}
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each filteredTheaters as t}
						<div
							class="group relative cursor-pointer overflow-hidden rounded-lg bg-slate-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
							tabindex="0"
							role="button"
							aria-label="Перейти к театру {t.name}"
							on:click={() => navigate(t.id)}
							on:keydown={(e) => handleKey(e, t.id)}
						>
							<!-- image -->
							<div class="relative h-48 overflow-hidden">
								<img
									src={img(t.photo)}
									alt={t.name}
									class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
								/>
								<div
									class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"
								></div>
								<span
									class="absolute top-4 right-4 rounded-full bg-yellow-500 px-3 py-1 text-sm font-bold text-black"
									>★ {t.yandex_rating}</span
								>
							</div>

							<!-- content -->
							<div class="p-6">
								<h2
									class="mb-2 text-xl font-bold text-white transition-colors duration-300 group-hover:text-blue-400"
								>
									{t.name}
								</h2>
								<p class="mb-3 line-clamp-2 text-sm text-gray-400">{t.address}</p>

								<!-- stats -->
								<div class="mb-4 flex items-center justify-between text-sm text-gray-300">
									<span class="rounded bg-slate-700 px-2 py-1"
										>Посещаемость {t.occupancy_percent}%</span
									>
									<div class="flex space-x-3">
										<span>{t.yandex_reviews_count} отзывов</span>
										<span>{t.yandex_ratings_count} оценок</span>
									</div>
								</div>

								<!-- venues -->
								<p class="mb-4 text-sm text-gray-400">
									{t.spaces.length} площадки / {seats(t)} мест
								</p>

								<!-- hr -->
								<div class="space-y-1 text-xs text-gray-400">
									<div><span class="font-semibold">Директор:</span> {dir(t)}</div>
									<div><span class="font-semibold">Худ. руководитель:</span> {artDir(t)}</div>
								</div>
							</div>

							<!-- hover overlay -->
							<div
								class="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							>
								<div class="absolute inset-0 bg-blue-600/10"></div>
								<svg
									class="absolute right-4 bottom-4 h-6 w-6 text-blue-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<!-- empty -->
				<div class="py-16 text-center text-gray-400">
					<svg class="mx-auto mb-4 h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.334-5.29-3.291M6 20.291A11.955 11.955 0 0112 18c2.34 0 4.29.79 5.29 2.291"
						/>
					</svg>
					<h3 class="mb-2 text-xl font-semibold">Театры не найдены</h3>
					<p>Попробуйте изменить поисковый запрос</p>
				</div>
			{/if}

			{#if searchQuery.trim()}
				<p class="mt-8 text-center text-gray-400">Найдено театров: {filteredTheaters.length}</p>
			{/if}
		</main>
	</div>

	<!-- footer -->
	<footer class="bg-slate-800 py-8">
		<p class="mx-auto max-w-6xl px-6 text-center text-gray-400">&copy;&nbsp;2025 Театры Москвы</p>
	</footer>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
