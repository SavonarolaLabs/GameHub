<script lang="ts">
	import { base } from '$app/paths';
	import { Users2, Building2, Network, Rocket } from 'lucide-svelte';

	type Card = { href: string; title: string; desc: string; icon: any };
	const cards: Card[] = [
		{
			href: `${base}/about`,
			title: 'О нас',
			desc: 'Миссия, команда, партнёры и как к нам присоединиться.',
			icon: Building2
		},
		{
			href: `${base}/community`,
			title: 'Комьюнити',
			desc: 'Категории участников, демостенд проектов, общие чаты и ссылки.',
			icon: Network
		},
		{
			href: `${base}/infrastructure`,
			title: 'Инфраструктура кластера',
			desc: 'Просмотровый зал, выставочная зона, фотограмметрия, студии, спортзал, ЦОД и др.',
			icon: Users2
		},
		{
			href: `${base}/programs`,
			title: 'Программы кластера',
			desc: 'Все меры поддержки и проекты с удобными фильтрами и тегами.',
			icon: Rocket
		}
	];
</script>

<svelte:head>
	<title>Кластер видеоигр — Главная</title>
	<meta
		name="description"
		content="Кластер видеоигр: участники, инфраструктура, программы поддержки и комьюнити."
	/>
</svelte:head>

<section class="relative">
	<div class="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950"></div>
	<div class="relative mx-auto max-w-7xl px-6 pt-14 pb-8">
		<h1 class="mb-4 text-4xl font-extrabold tracking-tight md:text-6xl">Кластер видеоигр</h1>
		<p class="max-w-2xl text-lg text-slate-300 md:text-xl">
			Экосистема для разработчиков игр: площадки, оборудование, программы и сообщество.
		</p>
	</div>
</section>

<section class="mx-auto max-w-7xl px-6 pb-16">
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
		{#each cards as c}
			<a
				href={c.href}
				class="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] transition hover:bg-slate-900 md:p-8"
			>
				<div class="flex items-start gap-4">
					<svelte:component this={c.icon} size={28} class="mt-1 opacity-90" />
					<div>
						<h2 class="mb-1 text-xl font-semibold group-hover:text-white md:text-2xl">{c.title}</h2>
						<p class="text-sm text-slate-400 md:text-base">{c.desc}</p>
					</div>
				</div>
			</a>
		{/each}
	</div>

	<!-- при желании: быстрая ссылка на новости -->
	<div class="mt-10">
		<a class="text-sm text-blue-300 hover:underline" href={`${base}/news`}
			>Новости кластера (скоро)</a
		>
	</div>
</section>
