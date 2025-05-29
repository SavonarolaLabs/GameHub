<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { theaters } from '$lib/theaters-data';

	/* --------- данные театра --------- */
	let theater: Theater = theaters[0];
	$: theater = theaters.find((t) => t.id === Number($page.params.id)) || theater;

	/* --------- helpers --------- */
	const theaterimg = (file: string) => `${base}/theaters/${file}.jpg`;
	const spaceimg = (file: string) => `${base}/spaces/${file}.jpg`;
	const productionimg = (file: string) => `${base}/productions/${file}.jpg`;
	$: totalSeats = theater.spaces.reduce((s, v) => s + (v.total_capacity ?? 0), 0);

	$: directors = theater.hr.filter((h) => h.position.trim().toLowerCase().startsWith('директор'));
	$: artisticDirectors = theater.hr.filter((h) =>
		h.position.trim().toLowerCase().includes('художественный')
	);

	/* раскрытие площадок */
	let expanded = -1; // индекс раскрытой площадки
</script>

<div class="flex min-h-screen w-full flex-col items-center">
	<!-- header -->
	<div class="w-full bg-slate-900 text-white">
		<header class="mx-auto w-full max-w-6xl p-6">
			<div class="flex flex-col justify-between lg:flex-row">
				<!-- left -->
				<div class="flex-1">
					<h1 class="mb-4 text-4xl font-bold">{theater.name}</h1>
					<p class="mb-2 text-gray-400">{theater.address}</p>
					{#if theater.maps_link}
						<a
							class="mb-6 inline-block text-blue-400 underline"
							href={theater.maps_link}
							target="_blank"
							rel="noopener">Открыть в&nbsp;Яндекс.Картах</a
						>
					{/if}

					<!-- hr -->
					<h3 class="mb-4 text-xl font-semibold">РУКОВОДСТВО</h3>
					<div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
						{#each directors as p}
							<div class="flex items-center space-x-3">
								<div class="h-12 w-12 shrink-0 rounded-full bg-gray-600"></div>
								<div>
									<div class="font-semibold">{p.full_name}</div>
									<div class="text-sm text-gray-400">Директор</div>
								</div>
							</div>
						{/each}
						{#each artisticDirectors as p}
							<div class="flex items-center space-x-3">
								<div class="h-12 w-12 shrink-0 rounded-full bg-gray-600"></div>
								<div>
									<div class="font-semibold">{p.full_name}</div>
									<div class="text-sm text-gray-400">Художественный руководитель</div>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- right -->
				<div class="mt-8 w-full lg:mt-0 lg:ml-8 lg:w-80">
					<div class="mb-4 rounded-lg bg-slate-700 p-4">
						<span
							class="mb-2 inline-block rounded bg-yellow-500 px-2 py-1 text-sm font-bold text-black"
							>★ {theater.yandex_rating}</span
						>

						<div class="space-y-2 text-sm text-gray-300">
							<p>
								Средняя цена билета: <strong>{theater.ticket_price_rub.toLocaleString()} ₽</strong>
							</p>
							<p><strong>Отзывы:</strong> {theater.yandex_reviews_count}</p>
							<p><strong>Оценки:</strong> {theater.yandex_ratings_count}</p>
						</div>
					</div>

					<!-- фото -->
					<div class="mb-4 overflow-hidden rounded-lg bg-slate-700">
						<img
							class="h-48 w-full object-cover"
							src={theaterimg(theater.photo)}
							alt={theater.name}
						/>
					</div>

					<button
						class="w-full rounded bg-slate-600 px-4 py-3 text-left transition-colors hover:bg-slate-500"
						>Посещаемость {theater.occupancy_percent}%</button
					>
				</div>
			</div>
		</header>
	</div>

	<!-- контент -->
	<div class="w-full bg-slate-900 text-white">
		<section class="mx-auto w-full max-w-6xl p-6">
			<h2 class="mb-6 text-2xl font-bold">{theater.spaces.length} площадки / {totalSeats} мест</h2>

			{#each theater.spaces as s, i}
				<div class="mb-6 rounded-lg bg-red-500">
					<button
						class="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-red-600"
						on:click={() => (expanded = expanded === i ? -1 : i)}
					>
						<span class="text-xl font-semibold"
							>{s.venue_space_short_name} / {s.total_capacity} мест</span
						>
						<svg
							class="h-6 w-6 transition-transform duration-300 {expanded === i ? 'rotate-180' : ''}"
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

					{#if expanded === i}
						<div class="bg-slate-800 p-6">
							<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
								<!-- info -->
								<div>
									<p class="mb-4">
										<span class="text-sm text-gray-400">Тип:</span>
										<span class="font-semibold">{s.type}</span>
									</p>
									<p class="mb-4">
										<span class="text-sm text-gray-400">Округ / район:</span>
										{s.okrug} / {s.district}
									</p>
									<p class="mb-4 text-sm text-gray-300">
										Коммерческих мест: <strong>{s.commercial_capacity}</strong><br />
										Неудобных мест: <strong>{s.inconvenient_seats}</strong>
									</p>
								</div>

								<!-- фото площадки -->
								<div
									class="flex h-40 items-center justify-center overflow-hidden rounded bg-gray-600"
								>
									{#if s.photo}
										<img
											class="h-full w-full object-cover"
											src={spaceimg(s.photo)}
											alt={s.venue_space_short_name}
										/>
									{:else}
										<span class="text-gray-400">Фото недоступно</span>
									{/if}
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</section>

		<section class="mx-auto w-full max-w-6xl p-6">
			<h2 class="mb-8 text-3xl font-bold">СПЕКТАКЛИ</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each theater.productions as p}
					<div
						class="relative h-80 overflow-hidden rounded-lg bg-cover bg-center transition-transform duration-300 hover:scale-105"
						style="background-image:url('{productionimg(p.foto)}')"
					>
						<div
							class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
						></div>
						<div class="absolute right-0 bottom-0 left-0 p-6">
							<h3 class="mb-2 text-xl font-bold">{p.name}</h3>
						</div>
					</div>
				{/each}
			</div>
		</section>
	</div>
</div>
