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
	import { theatersFinance } from '$lib/theatersFinance';
	import { theatersExpenses } from '$lib/theatersExpenses';
	import DynamicChart from '$lib/DynamicChart.svelte';
	import { theatersDynamic } from '$lib/theatersDynamic';
	import PersonPopup from '$lib/PersonPopup.svelte';
	import HorizontalBarChart from '$lib/HorizontalBarChart.svelte';
	/* --------- данные театра --------- */
	let theater: Theater = theaters[0];
	let personalOpen = true; // Скрываем / Открываем артистов
	let artistsOpen = true; // Скрываем / Открываем артистов
	let financeYear = 2024; // Выбранный год, стандартно оставляем 2024 год
	$: expenseData = (() => {
		const t = theatersExpenses.find((x) => x.id === theater.id);
		if (!t) return [];

		const yr = t.years.find((y) => y.year === financeYear);
		if (!yr) return [];

		const { total, breakdown } = yr;
		/* helper, чтобы превращать «доля» в percent (0 … 1) */
		const pct = (v: number) => (v ? v : 0);

		return [
			{
				label: 'Всего',
				percent: 1,
				value: `${formatRubAbbreviated(total)}`
			},
			{
				label: 'ФОТ',
				percent: pct(breakdown.fot.share),
				value: formatRubAbbreviated(breakdown.fot.value),
				avg: pct(breakdown.fot.avgShare),
				avgPct: pct(breakdown.fot.avgShare)
			},
			{
				label: 'Авторские',
				percent: pct(breakdown.royalties.share),
				value: formatRubAbbreviated(breakdown.royalties.value),
				avg: pct(breakdown.royalties.avgShare),
				avgPct: pct(breakdown.royalties.avgShare)
			}
		];
	})();

	$: theater = theaters.find((t) => t.id === Number($page.params.id)) || theater;

	/* --------- helpers --------- */
	const theaterimg = (file: string) => `${base}/theaters/${file}_1.jpg`;
	const spaceimg = (file: string) => `${base}/spaces/${file}.jpg`;
	const productionimg = (file: string) => `${base}/productions/${file}.jpg`;
	const hrimg = (file: string) => `${base}/hr/${file}`;
	const socialsimg = (file: string) => `${base}/socials/${file}`;
	$: totalSeats = theater.spaces.reduce((s, v) => s + (v.total_capacity ?? 0), 0);
	$: premieres = theatersPremiers.find((t) => t.id === theater.id)?.premiers ?? [];
	$: finances = theatersFinance.find((t) => t.id === theater.id)?.year ?? [];

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

	const eventSales = [
		{ title: 'Плохие хорошие', sales: 49_802_200, share: 0.16 },
		{ title: 'Зойкина квартира', sales: 27_195_200, share: 0.09 },
		{ title: 'Барабаны в ночи', sales: 26_423_200, share: 0.09 },
		{ title: 'Женитьба Фигаро', sales: 22_556_950, share: 0.07 },
		{ title: 'Космос', sales: 16_986_750, share: 0.06 },
		{ title: 'Мышеловка', sales: 14_083_130, share: 0.05 },
		{ title: 'Эта прекрасная жизнь', sales: 13_515_800, share: 0.04 },
		{ title: 'Семейка Краузе', sales: 12_317_100, share: 0.04 },
		{ title: 'Ложные признания', sales: 11_612_550, share: 0.04 },
		{ title: 'Мадам Рубинштейн', sales: 10_862_760, share: 0.04 },
		{ title: 'Сделка', sales: 9_901_130, share: 0.03 },
		{ title: 'Слуга двух господ', sales: 9_115_300, share: 0.03 },
		{ title: 'Остров сокровищ', sales: 8_603_590, share: 0.03 },
		{ title: 'Влюбленный Шекспир', sales: 8_528_670, share: 0.03 },
		{ title: 'Заповедник', sales: 8_455_410, share: 0.03 },
		{ title: 'Завтра была война', sales: 7_694_760, share: 0.03 },
		{ title: 'Лицей', sales: 5_903_300, share: 0.02 },
		{ title: 'Рождество О. Генри', sales: 5_828_900, share: 0.02 },
		{ title: 'Три Ивана', sales: 5_190_630, share: 0.02 },
		{ title: 'Инспектор пришел', sales: 4_135_980, share: 0.01 },
		{ title: 'Полковнику никто…', sales: 4_075_150, share: 0.01 },
		{ title: 'Красавец мужчина', sales: 3_770_850, share: 0.01 },
		{ title: 'Обещание на рассвете', sales: 3_482_710, share: 0.01 },
		{ title: 'Тартюф', sales: 2_625_540, share: 0.01 },
		{ title: 'Буря', sales: 2_158_700, share: 0.01 }
	];

	/** форматируем числовое значение ₽ с пробелами-тысячниками */
	const fmtRub = (n: number) => new Intl.NumberFormat('ru-RU').format(n);
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
								#{rank.rankRevenue2025}
								<span class="text-gray-300">по выручке </span>
							</div>
							<div class="font-bold text-[#f03066]">
								#{rank.rankTickets2025}
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
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
							<img
								class="size-16 cursor-pointer rounded-full"
								src={hrimg(p.photo)}
								alt=""
								onclick={() => showPersonBio(p)}
							/>

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
			<button
				class="mt-10 mb-4 flex items-center gap-2 text-xl font-semibold"
				onclick={() => (artistsOpen = !artistsOpen)}
			>
				АРТИСТЫ
				<svg
					class="h-5 w-5 transition-transform duration-200 {artistsOpen ? 'rotate-180' : ''}"
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
			{#if artistsOpen}
				<div class="grid gap-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
					{#each hr.filter((h) => h.organizationInn == theater.id && h.position == 'топовые артисты') as p}
						<div class="relative h-30">
							<div class="flex items-start space-x-3">
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
								<img
									class="size-16 cursor-pointer rounded-full"
									src={hrimg(p.photo)}
									alt=""
									onclick={() => showPersonBio(p)}
								/>

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
			{/if}
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
			<section class="mx-auto w-full max-w-6xl p-6">
				<h2 class="mb-8 text-3xl font-bold">Общая информация</h2>
			</section>

			<!-- NEED TO ADD FUNCTION CONVERT BUDGET TO MLN -->
			<section class="mx-auto w-full max-w-6xl">
				<div class=" mx-auto flex max-w-6xl flex-wrap justify-between p-6 whitespace-nowrap">
					<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
						<div class="text-gray-400">Внебюджет МЛН, 2024</div>
						<div class="text-6xl">{finances.find((f) => f.year == financeYear)?.offBudget}</div>
					</h3>
					<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
						<div class="text-gray-400">Бюджет МЛН, 2024</div>
						<div class="text-6xl">{finances.find((f) => f.year == financeYear)?.budget}</div>
					</h3>
					<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
						<div class="text-gray-400">Бюджетная зависимость, 2024</div>
						<div class="text-6xl">{finances.find((f) => f.year == financeYear)?.dependence}</div>
					</h3>
				</div>
				<h2 class="mb-8 text-3xl font-bold">Внебюджет</h2>
				<HorizontalBarChart
					items={[
						{ label: 'Всего', percent: 1, value: '542 млн ₽', color: '#f03066' },
						{
							label: 'Билеты',
							percent: 0.92,
							value: '496,9 млн ₽',
							avg: 0.79,
							avgPct: 0.79,
							color: '#60a5fa'
						},
						{
							label: 'Гастроли',
							percent: 0.022,
							value: '11,8 млн ₽',
							avg: 0.034,
							avgPct: 0.034,
							color: '#10b981'
						},
						{
							label: 'Собственность',
							percent: 0.024,
							value: '13,2 млн ₽',
							avg: 0.047,
							avgPct: 0.047,
							color: '#f59e0b'
						},
						{
							label: 'Реклама',
							percent: 0.008,
							value: '4,5 млн ₽',
							avg: 0.007,
							avgPct: 0.007,
							color: '#a78bfa'
						}
					]}
				/>

				<!-- <div class=" mx-auto flex max-w-6xl flex-wrap justify-between whitespace-nowrap">
					<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
						<div class="text-gray-400">БИЛЕТЫ МЛН, 2024</div>
						<div class="text-gray-400">в среднем 79,0%</div>
						<div class="text-6xl">496,9 (92%)</div>
					</h3>
					<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
						<div class="text-gray-400">ГАСТРОЛИ МЛН, 2024</div>
						<div class="text-gray-400">в среднем 3,4%</div>
						<div class="text-6xl">11,8 (2,2%)</div>
					</h3>
					<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
						<div class="text-gray-400">СОБСТВЕННОСТЬ МЛН, 2024</div>
						<div class="text-gray-400">в среднем 4,7%</div>
						<div class="text-6xl">13,2 (2,4%)</div>
					</h3>
					<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
						<div class="text-gray-400">РЕКЛАМА МЛН, 2024</div>
						<div class="text-gray-400">в среднем 0,7%</div>
						<div class="text-6xl">4,5 (0,8%)</div>
					</h3>
				</div> -->
				<h2 class=" mb-8 text-3xl font-bold"></h2>
				<h2 class="mb-8 text-3xl font-bold">Расходы</h2>
				<HorizontalBarChart items={expenseData} />

				<div class=" mx-auto flex max-w-6xl flex-wrap justify-between p-6 whitespace-nowrap">
					<!-- раздел «Расходы» -->
					<!-- <h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
						<div class="text-gray-400">ВСЕГО МЛН, 2024</div>
						<div class="text-6xl">517</div>
					</h3>
					<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
						<div class="text-gray-400">ФОТ МЛН, 2024</div>
						<div class="text-gray-400">в среднем 45,0%</div>
						<div class="text-6xl">269 (52%)</div>
					</h3>
					<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
						<div class="text-gray-400">АВТОРСКИЕ МЛН, 2024</div>
						<div class="text-gray-400">в среднем 9,5%</div>
						<div class="text-6xl">0 (0%)</div>
					</h3> -->
				</div>
			</section>
			<section class="mx-auto w-full max-w-6xl p-6">
				<h2 class="mb-8 text-3xl font-bold">Аналитика по билетам</h2>
			</section>
			{#if ranking.find((r) => r.id === theater.id)}
				{@const rank = ranking.find((r) => r.id === theater.id)}

				<div class=" mx-auto flex max-w-6xl flex-wrap justify-between p-6 whitespace-nowrap">
					<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
						<div class="text-gray-400">ВЫРУЧКА, 2024</div>
						<div class="text-6xl">{formatRubAbbreviated(rank?.revenue2024)}</div>
					</h3>
					<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
						<div class="text-gray-400">БИЛЕТОВ, 2024</div>
						<div class="text-6xl">{formatRubAbbreviated(rank.tickets2024)}</div>
					</h3>
					<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
						<div class="text-gray-400">ЗАПОЛНЯЕМОСТЬ</div>
						<div class="text-6xl">{theater.occupancy_percent}%</div>
					</h3>
				</div>
			{/if}
			<div class=" mx-auto flex max-w-6xl flex-wrap justify-between p-6 whitespace-nowrap">
				<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
					<div class="text-gray-400">Постановок,2024</div>
					<div class="text-6xl">50</div>
				</h3>
				<h3 class="mt-10 mb-4 flex flex-col-reverse text-xl font-semibold">
					<div class="text-gray-400">Ср. Стоимость</div>
					<div class="text-6xl">2442</div>
				</h3>
			</div>
			<section class="mx-auto w-full max-w-6xl p-6">
				<DynamicChart data={dynamics} />
			</section>

			<h2 class="mb-8 text-3xl font-bold">Аналитика по мероприятиям - ТОП 25</h2>

			<table class="w-full text-left">
				<thead class="border-b border-slate-700 text-gray-400">
					<tr>
						<th class="py-2 pr-4">Название мероприятия</th>
						<th class="py-2 pr-4">Продажи, ₽</th>
						<th class="py-2">Доля</th>
					</tr>
				</thead>
				<tbody>
					{#each eventSales as e}
						<tr class="border-b border-slate-800 last:border-none">
							<td class="py-2 pr-4">{e.title}</td>
							<td class="py-2 pr-4">{fmtRub(e.sales)}</td>
							<td class="py-2">{Math.round(e.share * 100)}%</td>
						</tr>
					{/each}
				</tbody>
			</table>

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
