<script lang="ts">
	import { base } from '$app/paths';

	type EventItem = {
		id: number;
		title: string;
		city: string;
		start: string;
		end?: string;
		cover: string;
		url: string;
	};

	const events: EventItem[] = [
		{
			id: 1,
			title: 'Будущее игровой индустрии',
			city: 'Москва',
			start: '2025-12-11',
			end: '2025-12-12',
			cover: `${base}/images/event.jpg`,
			url: 'https://example.com/aki/event-1'
		},
		{
			id: 2,
			title: 'GameDev Meetup & Pitch',
			city: 'Санкт-Петербург',
			start: '2025-12-15',
			cover: `${base}/images/hero-gamepad.png`,
			url: 'https://example.com/aki/event-2'
		},
		{
			id: 3,
			title: 'XR / Audio-Prod Day',
			city: 'Казань',
			start: '2025-12-20',
			cover: `${base}/images/event.jpg`,
			url: 'https://example.com/aki/event-3'
		},
		{
			id: 4,
			title: 'Esports & Communities',
			city: 'Екатеринбург',
			start: '2026-01-22',
			cover: `${base}/images/hero-gamepad.png`,
			url: 'https://example.com/aki/event-4'
		},
		{
			id: 5,
			title: 'Интеллектуальная собственность в геймдеве',
			city: 'Новосибирск',
			start: '2026-01-30',
			cover: `${base}/images/event.jpg`,
			url: 'https://example.com/aki/event-5'
		}
	];

	let index = 0;
	const len = events.length;

	function next() {
		if (len > 3) index = (index + 1) % len;
	}
	function prev() {
		if (len > 3) index = (index - 1 + len) % len;
	}

	// ✅ Реактивно считаем 3 карточки
	$: visibleItems =
		len <= 3 ? events : [events[index % len], events[(index + 1) % len], events[(index + 2) % len]];

	function formatRange(ev: EventItem) {
		const M = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
		const d1 = new Date(ev.start),
			d2 = ev.end ? new Date(ev.end) : null;
		const f = (d: Date) => `${d.getDate()} ${M[d.getMonth()]}`;
		return d2 ? `${f(d1)}–${f(d2)}` : f(d1);
	}
</script>

<section class="relative py-14 md:py-20">
	<div class="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950 to-slate-900"></div>

	<div class="mx-auto max-w-7xl px-6">
		<h2 class="text-center text-3xl font-extrabold tracking-tight text-white md:text-5xl">
			Мероприятия
		</h2>

		<div class="relative mt-10">
			<!-- стрелка влево -->
			<button
				class="absolute top-1/2 left-0 z-20 -translate-y-1/2 rounded-full border border-slate-700/70 bg-slate-800/60 px-3 py-2 text-white backdrop-blur transition hover:bg-slate-800"
				on:click|stopPropagation={prev}
				aria-label="Назад"
				type="button">‹</button
			>

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each visibleItems as ev (ev.id)}
					<article
						class="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:-translate-y-0.5 hover:bg-slate-900"
					>
						<div class="overflow-hidden rounded-xl border border-slate-800">
							<img
								src={ev.cover}
								alt={ev.title}
								class="h-44 w-full object-cover md:h-56"
								loading="lazy"
								decoding="async"
								on:error={(e) => (e.currentTarget.src = `${base}/images/placeholder.jpg`)}
							/>
						</div>

						<h3 class="mt-4 text-lg font-semibold text-white md:text-xl">{ev.title}</h3>
						<div class="mt-1 text-sm text-slate-300">{formatRange(ev)}</div>
						<div class="mt-1 text-sm text-slate-400">📍 {ev.city}</div>

						<div class="mt-4">
							<a
								href={ev.url}
								target="_blank"
								rel="noopener"
								class="text-sm font-semibold text-blue-300 hover:underline"
							>
								Узнать больше →
							</a>
						</div>
					</article>
				{/each}
			</div>

			<!-- стрелка вправо -->
			<button
				class="absolute top-1/2 right-0 z-20 -translate-y-1/2 rounded-full border border-slate-700/70 bg-slate-800/60 px-3 py-2 text-white backdrop-blur transition hover:bg-slate-800"
				on:click|stopPropagation={next}
				aria-label="Вперёд"
				type="button">›</button
			>
		</div>
	</div>
</section>
