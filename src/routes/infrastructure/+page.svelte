<svelte:head><title>Инфраструктура — Кластер видеоигр</title></svelte:head>

<section class="mx-auto max-w-7xl px-6 py-10">
	<h1 class="mb-6 text-3xl font-bold md:text-4xl">Инфраструктура кластера</h1>
	<p class="mb-6 text-slate-300">
		Список доступных пространств и сервисов. Далее можно сделать отдельные подпути (например,
		/infrastructure/photogrammetry).
	</p>

	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each ['Просмотровый зал', 'Выставочная зона', 'Фотограмметрия', 'Торговые помещения', 'Капсульный отель', 'Мокап студия', 'Студия звукозаписи', 'Спортзал', 'ЦОД', 'Фудкорт', 'Парковка', 'Киберспортивная зона', 'Лекторий'] as item}
			<div class="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
				<h2 class="font-semibold">{item}</h2>
				<p class="mt-2 text-sm text-slate-400">Короткое описание и условия доступа.</p>
			</div>
		{/each}
	</div>
</section>
