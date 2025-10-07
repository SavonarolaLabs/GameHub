<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { base } from '$app/paths';

	type Slide = {
		id: number;
		title: string;
		caption?: string;
		desc?: string;
		media: string; // путь к изображению/видео
		mediaType?: 'image' | 'video';
	};

	export let heading = 'Инфраструктура кластера';
	export let subheading = 'Инфраструктура кластера изображается в 3D';

	// 3 заглушки — положи свои файлы в /static/images/
	export let slides: Slide[] = [
		{
			id: 1,
			title: 'Интерактивная инфраструктура',
			caption: '3D-экскурсия по кампусу',
			desc: 'Виртуальный обход территории, помещений и сервисных зон.',
			media: `${base}/images/infra-1.jpg`,
			mediaType: 'image'
		},
		{
			id: 2,
			title: 'Модули и этажные планы',
			caption: 'Конфигурации помещений',
			desc: 'Быстрая навигация по этажам, модулям и блокам.',
			media: `${base}/images/infra-2.jpg`,
			mediaType: 'image'
		},
		{
			id: 3,
			title: 'Зоны прототипирования',
			caption: 'Студии, лаборатории, звук',
			desc: 'Оборудование для продакшна, тестирования и QA.',
			media: `${base}/images/infra-3.jpg`,
			mediaType: 'image'
		}
	];

	let idx = 0;
	const count = () => slides.length;
	const go = (n: number) => (idx = (n + count()) % count());
	const next = () => go(idx + 1);
	const prev = () => go(idx - 1);

	// клавиатура
	const onKey = (e: KeyboardEvent) => {
		if (e.key === 'ArrowRight') next();
		if (e.key === 'ArrowLeft') prev();
	};

	// свайпы
	let startX = 0,
		deltaX = 0,
		dragging = false;
	const onPointerDown = (e: PointerEvent) => {
		dragging = true;
		startX = e.clientX;
	};
	const onPointerMove = (e: PointerEvent) => {
		if (!dragging) return;
		deltaX = e.clientX - startX;
	};
	const onPointerUp = () => {
		if (!dragging) return;
		if (deltaX < -80) next();
		else if (deltaX > 80) prev();
		dragging = false;
		deltaX = 0;
	};

	onMount(() => window.addEventListener('keydown', onKey));
	onDestroy(() => window.removeEventListener('keydown', onKey));
</script>

<section class="relative overflow-hidden py-14 md:py-20">
	<div class="absolute inset-0 -z-10 bg-gradient-to-b from-slate-900 to-slate-950"></div>

	<div class="mx-auto max-w-7xl px-6">
		<h2 class="text-center text-3xl font-extrabold tracking-tight text-white md:text-5xl">
			{heading}
		</h2>
		{#if subheading}
			<p class="mt-3 text-center text-slate-300 md:text-lg">{subheading}</p>
		{/if}

		<!-- Витрина -->
		<div
			class="relative mt-10 select-none"
			on:pointerdown={onPointerDown}
			on:pointermove={onPointerMove}
			on:pointerup={onPointerUp}
			on:pointercancel={onPointerUp}
			on:mouseleave={onPointerUp}
		>
			<!-- Лента -->
			<div
				class="flex transition-transform duration-500 ease-out"
				style={`transform: translateX(calc(${-idx * 100}% + ${dragging ? deltaX : 0}px));`}
			>
				{#each slides as s (s.id)}
					<article class="min-w-full px-1 sm:px-2">
						<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
							<!-- медиа слева (на md занимает 2/3) -->
							<div class="md:col-span-2">
								<div class="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
									{#if s.mediaType === 'video'}
										<video
											class="h-full w-full object-cover"
											src={s.media}
											playsinline
											muted
											autoplay
											loop
										/>
									{:else}
										<img
											src={s.media}
											alt={s.title}
											class="h-full w-full object-cover"
											loading="lazy"
											decoding="async"
											on:error={(e) => (e.currentTarget.src = `${base}/images/placeholder.jpg`)}
										/>
									{/if}
								</div>
							</div>

							<!-- текст -->
							<div class="flex flex-col justify-center">
								<div
									class="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
								>
									<div class="mb-2 inline-flex items-center gap-2">
										<span
											class="rounded-md border border-slate-700/70 px-2 py-0.5 text-xs font-semibold tracking-widest text-slate-300"
										>
											{String(s.id).padStart(2, '0')}
										</span>
										{#if s.caption}
											<span class="text-sm text-slate-400">{s.caption}</span>
										{/if}
									</div>
									<h3 class="mb-2 text-xl font-semibold text-white md:text-2xl">{s.title}</h3>
									{#if s.desc}
										<p class="text-slate-400">{s.desc}</p>
									{/if}
								</div>
							</div>
						</div>
					</article>
				{/each}
			</div>

			<!-- стрелки -->
			<button
				class="absolute top-1/2 left-0 -translate-y-1/2 rounded-full border border-slate-700/70 bg-slate-800/60 p-3 text-white backdrop-blur transition hover:bg-slate-800"
				aria-label="Предыдущий слайд"
				on:click={prev}>‹</button
			>

			<button
				class="absolute top-1/2 right-0 -translate-y-1/2 rounded-full border border-slate-700/70 bg-slate-800/60 p-3 text-white backdrop-blur transition hover:bg-slate-800"
				aria-label="Следующий слайд"
				on:click={next}>›</button
			>

			<!-- точки -->
			<div class="mt-6 flex justify-center gap-2">
				{#each slides as s, i}
					<button
						class="h-2.5 w-2.5 rounded-full transition"
						class:bg-white={i === idx}
						class:bg-slate-600={i !== idx}
						aria-label={`Перейти к слайду ${i + 1}`}
						on:click={() => go(i)}
					/>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	/* отключаем выделение текста при свайпе на десктопе */
	:global(body) {
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
</style>
