<script lang="ts">
	import { base } from '$app/paths';

	interface Production {
		id: number;
		name: string;
		foto: string;
	}
	interface Space {
		id: number;
		district: string;
		okrug: string;
		type: string;
		venue_space_short_name: string;
		commercial_capacity: number | null;
		inconvenient_seats: number | null;
		total_capacity: number | null;
		venue_space_id: string | null;
		photo: string;
	}
	interface HRPerson {
		full_name: string;
		position: string;
		photo: string | null;
	}
	interface Theater {
		id: number;
		name: string;
		address: string;
		photo: string;
		capacity: number | null;
		audience_thousands: number | null;
		occupancy_percent: number | null;
		ticket_price_rub: number | null;
		productions: Production[];
		spaces: Space[];
		hr: HRPerson[];
		maps_link: string;
		yandex_ratings_count: number | null;
		yandex_reviews_count: number | null;
		yandex_rating: number | null;
	}

	/* ---------------- helpers ---------------- */
	let searchQuery = '';

	const norm = (v: unknown) => String(v ?? '').toLowerCase();
	const seats = (t: Theater) => t.spaces.reduce((s, v) => s + (v.total_capacity ?? 0), 0);
	const dir = (t: Theater) =>
		t.hr.find((h) => h.position.trim().toLowerCase().startsWith('директор'))?.full_name ?? '—';
	const artDir = (t: Theater) =>
		t.hr.find((h) => h.position.trim().toLowerCase().includes('художественный'))?.full_name ?? '—';
	const img = (file: string) => `${base}/theaters/${file}_1.jpg`;

	// Реактивно считаем отфильтрованный список, без отдельной функции и без on:input
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

			<a class="text-blue-300 hover:underline" href={`${base}/rating`}>Рейтинг театров</a>
		</header>
	</div>

	<!-- grid -->
	<div class="flex w-full justify-center bg-slate-900">
		<main class="w-full max-w-6xl px-6 py-8"></main>
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
