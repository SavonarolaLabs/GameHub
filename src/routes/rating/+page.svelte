<script lang="ts">
	import { base } from '$app/paths';
	import { filterRows, aggregateByTitleHall, type OtherTypeMode } from '$lib/aggEvents';
	import type { EndedMode } from '$lib/aggEvents';

	import { goto } from '$app/navigation';
	import { ArrowLeft } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Рейтинг — Театры Москвы</title>
	<meta name="description" content="Рейтинг театров и спектаклей Москвы" />
</svelte:head>

<p class="text-red-400">123213</p>

<style>
	.tabular-nums {
		font-variant-numeric: tabular-nums;
	}
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
	.clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
