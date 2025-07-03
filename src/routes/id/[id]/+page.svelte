<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { hr } from '$lib/hr';
	import { theaterSocials } from '$lib/theaterSocials';
	import { theaters } from '$lib/theaters-data';
	import { ticketOperator } from '$lib/ticketOperator';
	import { ranking } from '$lib/ranking';
	import { ArrowLeft } from 'lucide-svelte';
	import GanttChart from '$lib/GanttChart.svelte';
	import { theatersPremiers } from '$lib/theatersPremiers';
	import DynamicChart from '$lib/DynamicChart.svelte';
	import { theatersDynamic } from '$lib/theatersDynamic';
	import PersonPopup from '$lib/PersonPopup.svelte';

	/* --------- данные театра --------- */
	let theater: Theater = theaters[0];
	$: theater = theaters.find((t) => t.id === Number($page.params.id)) || theater;

	/* --------- helpers --------- */
	const theaterimg = (file: string) => `${base}/theaters/${file}_1.jpg`;
	const spaceimg = (file: string) => `${base}/spaces/${file}.jpg`;
	const productionimg = (file: string) => `${base}/productions/${file}.jpg`;
	const hrimg = (file: string) => `${base}/hr/${file}`;
	const socialsimg = (file: string) => `${base}/socials/${file}`;
	$: totalSeats = theater.spaces.reduce((s, v) => s + (v.total_capacity ?? 0), 0);
	$: premieres = theatersPremiers.find((t) => t.id === theater.id)?.premiers ?? [];
	$: dynamics = theatersDynamic.find((t) => t.id === theater.id)?.dynamic ?? [];
	function trimTitles(titles: string): string {
		if (titles.length > 60) {
			return titles.slice(0, 60 - 3) + '...';
		} else {
			return titles;
		}
	}
	function titleCase(str: string) {
		// \p{L}+  — последовательность букв в любом алфавите (флаг u = Unicode)
		return str.replace(/\p{L}+/gu, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase());
	}
	function formatPhone(raw: string) {
		// 1. оставляем только цифры
		let d = raw.replace(/\D+/g, '');

		// 2. если 11 цифр и начинается на 8, меняем 8 → 7
		if (d.length === 11) {
			if (d[0] === '8') d = '7' + d.slice(1);

			// 3. раскладываем 1-3-3-2-2
			const m = d.match(/^(\d)(\d{3})(\d{3})(\d{2})(\d{2})$/);
			if (m) {
				const [, c, a, b, c2, d2] = m;
				return `+${c}-${a}-${b}-${c2}-${d2}`;
			}
		}

		// fallback: ничего не делаем
		return raw.trim();
	}
	function formatRubAbbreviated(number: number) {
		const abs = Math.abs(number);
		let suffix = '';
		let divisor = 1;

		if (abs >= 1e9) {
			suffix = ' млрд'; // миллиард
			divisor = 1e9;
		} else if (abs >= 1e6) {
			suffix = ' млн'; // миллион
			divisor = 1e6;
		} else if (abs >= 1e3) {
			suffix = ' тыс'; // тысяча
			divisor = 1e3;
		}

		const shortNumber = number / divisor;

		const formatted = new Intl.NumberFormat('ru-RU', {
			maximumFractionDigits: 1
		}).format(shortNumber);

		return `${formatted}${suffix}`;
	}
	/* раскрытие площадок */
	let expanded = -1; // индекс раскрытой площадки

	const goToMain = () => {
		window.location.href = '/';
	};
	function showPersonBio(p) {
		selectedPerson.name = p.fullName;
		selectedPerson.position = p.position;
		selectedPerson.photo = hrimg(p.photo);
		selectedPerson.biography = p.biography;
		showPopup = true;
	}

	let showPopup = false;
	let selectedPerson = {
		name: 'Жуков Владимир Иванович',
		position: 'Директор',
		photo: 'path/to/photo.jpg',
		biography: 'Биография ...'
	};
</script>

<div class="flex min-h-screen w-full flex-col items-center">
	<!-- header -->
	<div class="w-full bg-slate-900 text-white">
		<header class="mx-auto w-full max-w-6xl p-6 pt-25">
			<div class="flex flex-col justify-between lg:flex-row">
				<!-- left -->
				<div class="flex-1">
					<!-- Социальные сети театра -->
					<h1 class="mb-4 text-4xl font-bold">{theater.name}</h1>
					<div class="mb-2 flex flex-col">
						{#each ticketOperator.filter((s) => s.id == theater.id) as s}
							<div class="flex flex-wrap gap-4 whitespace-nowrap">
								{#each s.operators as operators}
									<div class="rounded-sm bg-slate-700 px-3">{operators.name}</div>
								{/each}
							</div>
						{/each}
					</div>

					<!-- hr -->
					<div class="mt-4 mb-8 line-clamp-4 opacity-[0.7]">{theater.description}</div>

					<p class="mb-2 text-gray-400">{theater.address}</p>
					<div class="flex flex-wrap items-center justify-between">
						<div>
							{#each theaterSocials.filter((s) => s.id == theater.id) as s}
								<div class="top-16 my-4 flex gap-4">
									{#each s.socials as social}
										<a target="_blank" href={social.link}
											><img class="size-6" src={socialsimg(social.photo)} alt="" />
										</a>
									{/each}
								</div>
							{/each}
						</div>
						<div>
							<div class="rounded-full border-2 px-3 text-slate-700">
								{theater.reconstruction}
							</div>
						</div>
					</div>
				</div>

				<!-- right -->
				<div class="mt-8 w-full lg:mt-0 lg:ml-8 lg:w-80">
					<div class="mb-4 rounded-lg bg-slate-800 p-4">
						{#if ranking.find((r) => r.id === theater.id)}
							{@const rank = ranking.find((r) => r.id === theater.id)}
							<div class="font-bold text-[#f03066]">
								#{rank.rankRevenue2024}
								<span class="text-gray-300">по выручке </span>
							</div>
							<div class="font-bold text-[#f03066]">
								#{rank.rankTickets2024}
								<span class="text-gray-300">по посещаемости</span>
							</div>
							<div class="mb-2"></div>
						{/if}
					</div>

					<!-- фото -->
					<div class="mb-4 overflow-hidden rounded-lg bg-slate-800">
						<img class="h-48 w-full object-cover" src={theaterimg(theater.id)} alt={theater.name} />
					</div>

					<div
						class="transition-color flex w-full items-center justify-between rounded bg-slate-700 px-4 py-3 text-left"
					>
						<div class="inline-block rounded bg-[#f03066] px-2 py-1 text-sm font-bold text-white">
							★ {theater.yandex_rating}
						</div>
						<p>Отзывы: {theater.yandex_reviews_count}</p>
						<p>Оценки: {theater.yandex_ratings_count}</p>
					</div>
				</div>
			</div>
			<!-- СОТРУДНИКИ -->
			<div class="flex flex-wrap justify-between whitespace-nowrap">
				<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
					<div class="text-gray-400">СОТРУДНИКИ</div>
					<div class="text-9xl">{theater.employees}</div>
				</h3>
				<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
					<div class="text-gray-400">ХУДОЖЕСТВЕННЫЙ ПЕРСОНАЛ</div>
					<div class="text-9xl">{theater.artistic_staff}</div>
				</h3>
				<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
					<div class="text-gray-400">АРТИСТЫ</div>
					<div class="text-9xl">{theater.cast}</div>
				</h3>
			</div>

			<h3 class="mt-10 mb-4 text-xl font-semibold">РУКОВОДСТВО</h3>
			<div class="grid gap-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
				{#each hr.filter((h) => h.organizationInn == theater.id && (h.position == 'директор' || h.position.startsWith('художественный'))) as p}
					<div class="relative h-30">
						<div class="flex items-start space-x-3">
							<button onclick={() => showPersonBio(p)}>
								<img class="size-16 rounded-full" src={hrimg(p.photo)} alt="" />
							</button>

							<div>
								<div class="font-semibold">{titleCase(p.fullName)}</div>
								<div class="text-sm text-gray-400">{titleCase(p.position)}</div>
								<div class="text-sm text-gray-400">{formatPhone(trimTitles(p.phone))}</div>
							</div>
						</div>
						<div class="absolute top-16 flex gap-4">
							{#if p.wikiUrl}
								<a target="_blank" href={p.wikiUrl}
									><img class="size-6" src={socialsimg('wiki.jpg')} alt="" />
								</a>
							{/if}
							{#if p.linkToTheaterSite}
								<a target="_blank" href={p.linkToTheaterSite}
									><img class="size-6" src={socialsimg(theater.id + '_logo.jpg')} alt="" />
								</a>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			<!-- пресс-служба -->
			<h3 class="mt-10 mb-4 text-xl font-semibold">ПРЕСС-СЛУЖБА</h3>
			<div class="grid gap-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
				{#each hr.filter((h) => h.organizationInn == theater.id && h.position == 'пресс-служба') as p}
					<div class="relative h-30">
						<div class="flex items-start space-x-3">
							<!-- <img class="size-16 rounded-full" src={hrimg(p.photo)} alt="" /> -->
							<div>
								<div class="font-semibold">{titleCase(p.fullName)}</div>
								<div class="text-sm text-gray-400">{titleCase(p.position)}</div>
								<div class="text-sm text-gray-400">{formatPhone(trimTitles(p.phone))}</div>
								<div class="text-sm text-gray-400">{trimTitles(p.email)}</div>
							</div>
						</div>
						<div class="absolute top-16 flex gap-4"></div>
					</div>
				{/each}

				<div class="relative h-30">
					<div class="flex items-start space-x-3">
						<a target="_blank" class="flex flex-col gap-2" href={theater.fotobankLink}>
							<img class="size-16 rounded-full" src={socialsimg(theater.id + '_logo.jpg')} alt="" />
							<div>
								<div class="text-sm text-gray-400">Фотобанк</div>
								<!-- <div class="text-sm text-gray-400">{titleCase(p.position)}</div>
								<div class="text-sm text-gray-400">{formatPhone(trimTitles(p.phone))}</div>
								<div class="text-sm text-gray-400">{trimTitles(p.email)}</div> -->
							</div>
						</a>
					</div>
					<div class="absolute top-16 flex gap-4"></div>
				</div>
			</div>

			<!-- АРТИСТЫ -->
			<h3 class="mt-10 mb-4 text-xl font-semibold">АРТИСТЫ</h3>
			<div class="grid gap-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
				{#each hr.filter((h) => h.organizationInn == theater.id && h.position == 'топовые артисты') as p}
					<div class="relative h-30">
						<div class="flex items-start space-x-3">
							<button class="size-16" onclick={() => showPersonBio(p)}>
								<img class="size-16 rounded-full" src={hrimg(p.photo)} alt="" />
							</button>

							<div>
								<div class="font-semibold">{p.fullName}</div>
								<div class="line-clamp-3 text-sm text-gray-400">{p.titles}</div>
							</div>
						</div>
						<div class="absolute top-16 flex gap-4">
							{#if p.wikiUrl}
								<a target="_blank" href={p.wikiUrl}
									><img class="size-6" src={socialsimg('wiki.jpg')} alt="" />
								</a>
							{/if}
							{#if p.linkToTheaterSite}
								<a target="_blank" href={p.linkToTheaterSite}
									><img class="size-6" src={socialsimg(theater.id + '_logo.jpg')} alt="" />
								</a>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</header>
	</div>

	<!-- контент -->
	<div class="w-full bg-slate-900 text-white">
		<section class="mx-auto w-full max-w-6xl p-6">
			<h2 class="mb-6 text-2xl font-bold">{theater.spaces.length} площадки / {totalSeats} мест</h2>

			{#each theater.spaces as s, i}
				<div class="mb-6 rounded-lg bg-slate-700">
					<button
						class="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-600"
						onclick={() => (expanded = expanded === i ? -1 : i)}
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
						<div class="bg-slate-750 p-6">
							<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
								<!-- info -->
								<div>
									<p class="mb-4">
										<span class="text-sm text-gray-400">Тип:</span>
										<span class="">{s.type}</span>
									</p>
									<p class="mb-4">
										<span class="text-sm text-gray-400">Жанр:</span>
										<span class="">{titleCase(s.genre)}</span>
									</p>
									<p class="mb-4">
										<span class="text-sm text-gray-400">Округ / район:</span>
										{s.okrug} / {s.district}
									</p>
									<p class="mb-4">
										<span class="text-sm text-gray-400">Адресс:</span>
										<span class="">{titleCase(s.address)}</span>
									</p>
									<!-- <p class="mb-4 text-sm text-gray-300">
										Коммерческих мест: <strong>{s.commercial_capacity}</strong><br />
										Неудобных мест: <strong>{s.inconvenient_seats}</strong>
									</p> -->
									{#if s.maps_link}
										<a
											class="mb-6 inline-block text-blue-400 underline"
											href={s.maps_link}
											target="_blank"
											rel="noopener">Открыть в&nbsp;Яндекс.Картах</a
										>
									{/if}
								</div>

								<!-- фото площадки -->
								<div
									class="flex h-40 items-center justify-center overflow-hidden rounded bg-slate-600"
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
			<h2 class="mb-8 text-3xl font-bold">КАЛЕНДАРЬ ПРЕМЬЕР</h2>
			<GanttChart items={premieres} />
		</section>

		{#if ranking.find((r) => r.id === theater.id)}
			{@const rank = ranking.find((r) => r.id === theater.id)}

			<div class=" mx-auto flex max-w-6xl flex-wrap justify-between p-6 whitespace-nowrap">
				<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
					<div class="text-gray-400">ВЫРУЧКА</div>
					<div class="text-6xl">{formatRubAbbreviated(rank.revenue2025)}</div>
				</h3>
				<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
					<div class="text-gray-400">БИЛЕТОВ</div>
					<div class="text-6xl">{formatRubAbbreviated(rank.tickets2025)}</div>
				</h3>
				<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
					<div class="text-gray-400">ЗАПОЛНЯЕМОСТЬ</div>
					<div class="text-6xl">{theater.occupancy_percent}%</div>
				</h3>
			</div>
		{/if}

		<section class="mx-auto w-full max-w-6xl p-6">
			<DynamicChart data={dynamics} />
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

	<!-- Back to main button -->
	<button class="back-to-main-btn" onclick={goToMain} aria-label="Back to main">
		<ArrowLeft size={24} />
	</button>
</div>

<PersonPopup bind:isOpen={showPopup} person={selectedPerson} on:close={() => (showPopup = false)} />

<style>
	.back-to-main-btn {
		position: fixed;
		left: 1.5rem;
		top: 1.5rem;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: #374151;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.15s ease;
		border: none;
		outline: none;
		z-index: 50;
	}
	.back-to-main-btn:hover {
		transform: scale(1.08);
		background: #4b5563;
	}
</style>
