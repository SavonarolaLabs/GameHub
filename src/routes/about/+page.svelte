<script lang="ts">
	import { base } from '$app/paths';
	let {} = $props();
</script>

<svelte:head>
	<title>О нас — Кластер видеоигр</title>
</svelte:head>

<section class="mx-auto max-w-7xl px-6 py-10">
	<h1 class="mb-6 text-3xl font-bold md:text-4xl">О нас</h1>
	<p class="mb-6 text-slate-300">
		Здесь будет миссия кластера, направления работы, команда, партнёры и контакты.
	</p>

	<div class="grid gap-6 md:grid-cols-3">
		<div class="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
			<h2 class="mb-2 font-semibold">Миссия</h2>
			<p class="text-sm text-slate-400">Коротко о целях и ценностях.</p>
		</div>
		<div class="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
			<h2 class="mb-2 font-semibold">Команда</h2>
			<p class="text-sm text-slate-400">Ключевые роли и контакты.</p>
		</div>
		<div class="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
			<h2 class="mb-2 font-semibold">Партнёры</h2>
			<p class="text-sm text-slate-400">Лого и ссылки партнёров.</p>
		</div>
	</div>
</section>
