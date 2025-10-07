<script lang="ts">
	import { base } from '$app/paths';
	import HeroSection from '$lib/components/HeroSection.svelte';
	import BenefitsSection from '$lib/components/BenefitsSection.svelte';
	import InfraCarousel from '$lib/components/InfraCarousel.svelte';
	import EventsSection from '$lib/components/EventsSection.svelte';
	import ResidentFormSection from '$lib/components/ResidentFormSection.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';

	import {
		Users2,
		Building2,
		Network,
		Rocket,
		CalendarDays,
		Store,
		BookOpen,
		Plane
	} from 'lucide-svelte';

	type Card = { href: string; title: string; desc: string; icon: any };
	const cards: Card[] = [
		{ href: `${base}/about`, title: 'О нас', desc: 'Миссия, команда, партнёры.', icon: Building2 },
		{
			href: `${base}/community`,
			title: 'Комьюнити',
			desc: 'Категории участников, демо-проекты, ссылки.',
			icon: Network
		},
		{
			href: `${base}/infrastructure`,
			title: 'Инфраструктура',
			desc: 'Площадки, студии, сервисы.',
			icon: Users2
		},
		{
			href: `${base}/programs`,
			title: 'Программы кластера',
			desc: 'Меры поддержки и проекты.',
			icon: Rocket
		},

		// Новые разделы
		{
			href: `${base}/events`,
			title: 'Мероприятия отрасли',
			desc: 'Календарь, фильтры и поиск.',
			icon: CalendarDays
		},
		{
			href: `${base}/market`,
			title: 'Hub Market',
			desc: 'Услуги кластера и вакансии.',
			icon: Store
		},
		{
			href: `${base}/library`,
			title: 'Библиотека',
			desc: 'Гайды, документы, шаблоны.',
			icon: BookOpen
		},
		{
			href: `${base}/residency`,
			title: 'Релокация / резидентство',
			desc: 'Условия, FAQ, как подать заявку.',
			icon: Plane
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

<HeroSection
	title="Moscow game hub"
	subtitle="Одно место для разработки игр: инфраструктура, менторы, сообщество и программы поддержки."
	ctaText="Связаться с нами"
	ctaHref={`${base}/contact`}
	imageSrc={`${base}/images/hero-gamepad.png`}
/>

<BenefitsSection />
<InfraCarousel />
<EventsSection />
<ResidentFormSection on:submit={(e) => console.log('payload:', e.detail)} />

<section class="relative">
	<div class="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950"></div>
	<div class="relative mx-auto max-w-7xl px-6 pt-14 pb-8">
		<h1 class="mb-4 text-4xl font-extrabold tracking-tight md:text-6xl">Кластер видеоигр</h1>
		<p class="max-w-2xl text-lg text-slate-300 md:text-xl">
			Эта часть на всякий случай, чтобы исходные разделы видно было, которые хотим добавить
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
	<!-- <div class="mt-10">
		<a class="text-sm text-blue-300 hover:underline" href={`${base}/news`}
			>Новости кластера (скоро)</a
		>
	</div> -->
</section>
