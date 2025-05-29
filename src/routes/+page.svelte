<script lang="ts">
	import { base } from '$app/paths';
	import { theaters, type Theater } from '$lib/theaters-data';
	import { goto } from '$app/navigation';

	let searchQuery = '';
	let filteredTheaters: Theater[] = theaters;

	$: {
		if (searchQuery.trim() === '') {
			filteredTheaters = theaters;
		} else {
			const query = searchQuery.toLowerCase();
			filteredTheaters = theaters.filter(
				(theater) =>
					theater.name.toLowerCase().includes(query) ||
					theater.fullName.toLowerCase().includes(query) ||
					theater.description.toLowerCase().includes(query) ||
					theater.genre.toLowerCase().includes(query)
			);
		}
	}

	function navigateToTheater(theaterId: number) {
		goto(`${base}/id/${theaterId}`);
	}

	function handleKeydown(event: KeyboardEvent, theaterId: number) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			navigateToTheater(theaterId);
		}
	}
</script>

<svelte:head>
	<title>Театры Москвы - Справочник театров Москвы</title>
	<meta
		name="description"
		content="Справочник театров Москвы с информацией о спектаклях, рейтингах и отзывах"
	/>
</svelte:head>

<div class="min-h-screen bg-slate-900">
	<!-- Header Section -->
	<div class="flex w-full justify-center bg-gradient-to-b from-slate-800 to-slate-900">
		<header class="w-full max-w-6xl px-6 py-12">
			<div class="text-center text-white">
				<h1 class="mb-4 text-5xl font-bold">Театры Москвы</h1>
				<p class="mb-8 text-xl text-gray-300">Справочник театров Москвы</p>

				<!-- Search Bar -->
				<div class="mx-auto mb-8 max-w-2xl">
					<div class="relative">
						<input
							type="text"
							bind:value={searchQuery}
							placeholder="Поиск театров..."
							class="w-full rounded-lg bg-slate-700 px-6 py-4 text-lg text-white placeholder-gray-400 transition-all duration-300 focus:bg-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
						<div class="absolute top-1/2 right-4 -translate-y-1/2">
							<svg
								class="h-6 w-6 text-gray-400"
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
					</div>
				</div>
			</div>
		</header>
	</div>

	<!-- Theater Grid Section -->
	<div class="flex w-full justify-center bg-slate-900">
		<main class="w-full max-w-6xl px-6 py-8">
			{#if filteredTheaters.length > 0}
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each filteredTheaters as theater}
						<div
							class="group relative cursor-pointer overflow-hidden rounded-lg bg-slate-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
							on:click={() => navigateToTheater(theater.id)}
							on:keydown={(e) => handleKeydown(e, theater.id)}
							role="button"
							tabindex="0"
							aria-label="Перейти к театру {theater.name}"
						>
							<!-- Theater Image -->
							<div class="relative h-48 overflow-hidden">
								<img
									src={theater.imageUrl}
									alt={theater.name}
									class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
								/>
								<div
									class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"
								></div>

								<!-- Rating Badge -->
								<div class="absolute top-4 right-4">
									<span class="rounded-full bg-yellow-500 px-3 py-1 text-sm font-bold text-black">
										★ {theater.rating}
									</span>
								</div>
							</div>

							<!-- Theater Info -->
							<div class="p-6">
								<h2
									class="mb-2 text-xl font-bold text-white transition-colors duration-300 group-hover:text-blue-400"
								>
									{theater.name}
								</h2>

								<p class="mb-3 line-clamp-2 text-sm text-gray-400">
									{theater.description}
								</p>

								<!-- Theater Stats -->
								<div class="mb-4 flex items-center justify-between text-sm text-gray-300">
									<span class="rounded bg-slate-700 px-2 py-1">{theater.genre}</span>
									<div class="flex space-x-3">
										<span>{theater.reviews} отзывов</span>
										<span>{theater.scores} оценок</span>
									</div>
								</div>

								<!-- Venues Info -->
								<div class="mb-4">
									<div class="text-sm text-gray-400">
										{theater.venues.length} площадки / {theater.venues.reduce(
											(s, v) => s + v.seats,
											0
										)} мест
									</div>
								</div>

								<!-- Management -->
								<div class="space-y-1 text-xs text-gray-400">
									<div><span class="font-semibold">Директор:</span> {theater.director}</div>
									<div>
										<span class="font-semibold">Худ. руководитель:</span>
										{theater.artisticDirector}
									</div>
								</div>

								<!-- Renovation Status -->
								<div class="mt-4">
									{#if theater.renovation === 'planned'}
										<span class="inline-block rounded bg-yellow-600 px-2 py-1 text-xs text-white">
											Запланирован ремонт
										</span>
									{:else if theater.renovation === 'not_planned'}
										<span class="inline-block rounded bg-green-600 px-2 py-1 text-xs text-white">
											Ремонт не требуется
										</span>
									{:else}
										<span class="inline-block rounded bg-red-600 px-2 py-1 text-xs text-white">
											Неудовлетворительное состояние
										</span>
									{/if}
								</div>
							</div>

							<!-- Hover Effect Overlay -->
							<div
								class="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							>
								<div class="absolute inset-0 bg-blue-600/10"></div>
								<div class="absolute right-4 bottom-4">
									<svg
										class="h-6 w-6 text-blue-400"
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
						</div>
					{/each}
				</div>
			{:else}
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

			<!-- Results Count -->
			{#if searchQuery.trim() !== ''}
				<div class="mt-8 text-center text-gray-400">
					Найдено театров: {filteredTheaters.length}
				</div>
			{/if}
		</main>
	</div>

	<!-- Footer -->
	<footer class="bg-slate-800 py-8">
		<div class="mx-auto max-w-6xl px-6 text-center text-gray-400">
			<p>&copy; 2025 Театры Москвы. Справочник театров Москвы.</p>
		</div>
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
