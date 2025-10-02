<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';
	let { children } = $props();

	const nav = [
		{ href: `${base}/about`, label: 'О нас' },
		{ href: `${base}/community`, label: 'Комьюнити' },
		{ href: `${base}/infrastructure`, label: 'Инфраструктура' },
		{ href: `${base}/programs`, label: 'Программы' },
		{ href: `${base}/events`, label: 'Мероприятия' },
		{ href: `${base}/market`, label: 'Hub Market' },
		{ href: `${base}/library`, label: 'Библиотека' },
		{ href: `${base}/residency`, label: 'Релокация/резидентство' }
	];
</script>

<div class="flex min-h-screen flex-col bg-slate-950 text-slate-100">
	<header class="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
			<a class="text-lg font-semibold tracking-wide" href={`${base}/`}>Кластер видеоигр</a>
			<nav class="hidden gap-6 text-sm md:flex">
				{#each nav as item}
					<a class="text-slate-300 hover:text-white" href={item.href}>{item.label}</a>
				{/each}
			</nav>
		</div>
	</header>

	<main class="flex-1">{@render children()}</main>

	<footer class="border-t border-slate-800 bg-slate-900">
		<p class="mx-auto max-w-7xl px-6 py-6 text-center text-slate-400">
			&copy; {new Date().getFullYear()} Кластер видеоигр
		</p>
	</footer>
</div>
