<script lang="ts">
	import { page } from '$app/stores';
	import { theaters, type Theater } from '$lib/theaters-data';

	let theater: Theater = theaters[0];
	$: theater = theaters.find((t) => t.id === Number($page.params.id)) || theater;

	let mainStageExpanded = false;
	$: totalSeats = theater.venues.reduce((s, v) => s + v.seats, 0);

	$: statusText =
		theater.renovation === 'planned'
			? 'Запланирован ремонт'
			: theater.renovation === 'not_planned'
				? 'Ремонт не требуется'
				: 'Неудовлетворительное состояние';

	const showImages = [
		'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
		'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
		'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=400&h=300&fit=crop',
		'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&h=300&fit=crop',
		'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=300&fit=crop',
		'https://images.unsplash.com/photo-1489537235181-fc05daed5805?w=400&h=300&fit=crop'
	];
</script>

<div class="flex min-h-screen w-full flex-col items-center">
	<div class="flex w-full justify-center bg-slate-800 bg-slate-900 text-white">
		<header class="max-w-6xl p-6">
			<div class="flex items-start justify-between">
				<div class="flex-1">
					<h1 class="mb-4 text-4xl font-bold">{theater.name}</h1>
					<p class="mb-6 max-w-2xl leading-relaxed text-gray-300">{theater.description}</p>
					<div class="mb-6">
						<h3 class="mb-4 text-xl font-semibold">РУКОВОДСТВО</h3>
						<div class="flex items-center space-x-8">
							<div class="flex items-center space-x-3">
								<div class="h-12 w-12 rounded-full bg-gray-600"></div>
								<div>
									<div class="font-semibold">{theater.director}</div>
									<div class="text-sm text-gray-400">Директор</div>
								</div>
							</div>
							<div class="flex items-center space-x-3">
								<div class="h-12 w-12 rounded-full bg-gray-600"></div>
								<div>
									<div class="font-semibold">{theater.artisticDirector}</div>
									<div class="text-sm text-gray-400">Художественный руководитель</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="ml-8 w-80">
					<div class="mb-4 rounded-lg bg-slate-700 p-4">
						<div class="mb-2 flex items-center justify-between">
							<span class="rounded bg-yellow-500 px-2 py-1 text-sm font-bold text-black">#1</span>
							<div class="flex space-x-2">
								<button
									class="rounded bg-red-500 px-4 py-2 text-sm transition-colors hover:bg-red-600"
								>
									Справочник
								</button>
								<button
									class="rounded bg-blue-500 px-4 py-2 text-sm transition-colors hover:bg-blue-600"
								>
									Показатели
								</button>
							</div>
						</div>
						<div class="mb-3 text-sm text-gray-300">по выручке<br />по посещаемости</div>
						<div class="space-y-2">
							<div><span class="text-lg font-bold">Рейтинг: {theater.rating}</span></div>
							<div class="flex space-x-4">
								<span><strong>Отзывы:</strong> {theater.reviews}</span>
								<span><strong>Оценки:</strong> {theater.scores}</span>
							</div>
						</div>
					</div>
					<div class="mb-4 overflow-hidden rounded-lg bg-slate-700">
						<img src={theater.imageUrl} alt={theater.name} class="h-48 w-full object-cover" />
					</div>
					<div class="space-y-2">
						<button
							class="w-full rounded bg-slate-600 px-4 py-3 text-left transition-colors hover:bg-slate-500"
						>
							{statusText}
						</button>
					</div>
				</div>
			</div>
		</header>
	</div>
	<div class="flex w-full flex-col items-center bg-slate-900 text-white">
		<section class="w-full max-w-6xl p-6">
			<h2 class="mb-6 text-2xl font-bold">{theater.venues.length} ПЛОЩАДКИ / {totalSeats} мест</h2>
			<div class="mb-4 rounded-lg bg-red-500">
				<button
					class="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-red-600"
					on:click={() => (mainStageExpanded = !mainStageExpanded)}
				>
					<span class="text-xl font-semibold">Основная сцена / {theater.venues[0].seats} места</span
					>
					<svg
						class="h-6 w-6 transition-transform duration-300 {mainStageExpanded
							? 'rotate-180'
							: ''}"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</button>
				{#if mainStageExpanded}
					<div class="bg-slate-800 p-6">
						<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
							<div>
								<div class="mb-4">
									<span class="text-sm text-gray-400">Жанр:</span>
									<span class="ml-2 font-semibold">{theater.genre}</span>
								</div>
								<div class="mb-4">
									<span class="text-sm text-gray-400">Адрес:</span>
									<span class="ml-2">{theater.address}</span>
								</div>
								<div class="grid grid-cols-3 gap-2">
									<div class="h-20 rounded bg-gray-600"></div>
									<div class="h-20 rounded bg-gray-600"></div>
									<div class="h-20 rounded bg-gray-600"></div>
								</div>
							</div>
							<div>
								<div class="mb-4 flex h-40 items-center justify-center rounded bg-gray-600">
									<span class="text-gray-400">Карта</span>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
			<div class="mb-6 rounded-lg bg-red-500">
				<button
					class="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-red-600"
				>
					<span class="text-xl font-semibold">Малая сцена</span>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			</div>
		</section>
		<section class="w-full max-w-6xl p-6">
			<h2 class="mb-8 text-3xl font-bold">СПЕКТАКЛИ</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each theater.shows as show, i}
					<div
						class="relative h-80 overflow-hidden rounded-lg bg-cover bg-center transition-transform duration-300 hover:scale-105"
						style="background-image: url('{showImages[i % showImages.length]}')"
					>
						<div
							class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
						></div>
						<div class="absolute right-0 bottom-0 left-0 p-6">
							<h3 class="mb-2 text-xl font-bold">{show.title}</h3>
							<p class="mb-2 text-sm text-gray-300">{show.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</section>
	</div>
</div>
