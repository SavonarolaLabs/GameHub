<script lang="ts">
	import { createEventDispatcher, onMount, afterUpdate } from 'svelte';

	export let isOpen = false;
	export let person: {
		name: string;
		position: string;
		photo: string | null;
		biography: string;
	} = {
		name: 'Иванов Александр Петрович',
		position: 'Художественный руководитель',
		photo: 'https://via.placeholder.com/200x250/4A5568/FFFFFF?text=Фото',
		biography: 'Заслуженный артист Российской Федерации, выпускник МГИК. ...'
	};

	// Встроенный SVG-плейсхолдер для сотрудников (кружок-аватар)
	const defaultStaffFallback =
		'data:image/svg+xml;utf8,' +
		encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="160">
  <rect width="100%" height="100%" fill="#334155"/>
  <circle cx="64" cy="56" r="28" fill="#64748b"/>
  <rect x="20" y="108" width="88" height="40" rx="20" fill="#64748b"/>
</svg>`);

	/** Можно передать свой плейсхолдер извне; если пусто — используем встроенный */
	export let fallbackSrc: string = defaultStaffFallback;

	const dispatch = createEventDispatcher();

	function closePopup() {
		isOpen = false;
		dispatch('close');
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) closePopup();
	}
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') closePopup();
	}

	/** Ссылки на оба <img> */
	let imgSmall: HTMLImageElement | null = null;
	let imgLarge: HTMLImageElement | null = null;

	/** Навесить надёжный onerror на указанный <img> */
	function attachOnError(el: HTMLImageElement | null) {
		if (!el) return;
		el.onerror = () => {
			// защита от зацикливания
			if (fallbackSrc && el.src !== fallbackSrc) {
				el.src = fallbackSrc;
			}
		};
	}

	onMount(() => {
		attachOnError(imgSmall);
		attachOnError(imgLarge);
	});

	// Если меняется person.photo или сам элемент, переустановим обработчики
	afterUpdate(() => {
		attachOnError(imgSmall);
		attachOnError(imgLarge);
	});

	// Удобные "источники" для картинок с мгновенным фоллбеком, если photo пусто
	$: photoSrc = person.photo && person.photo.trim() ? person.photo : fallbackSrc;
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<!-- Backdrop -->
	<div
		class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-[#0009] p-4"
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="popup-title"
	>
		<!-- Modal -->
		<div class="max-h[90vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-2xl">
			<!-- Header -->
			<div class="relative bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
				<button
					onclick={closePopup}
					class="absolute top-4 right-4 text-white transition-colors hover:text-gray-300"
					aria-label="Закрыть"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>

				<div class="flex items-center space-x-4">
					<!-- Photo (маленькая) -->
					<div class="flex-shrink-0">
						<img
							bind:this={imgSmall}
							src={photoSrc}
							alt={person.name}
							class="h-24 w-20 rounded-lg border-2 border-white object-cover shadow-lg"
							onerror={() => {}}
						/>
					</div>

					<!-- Name and Position -->
					<div>
						<h2 id="popup-title" class="mb-1 text-2xl font-bold">{person.name}</h2>
						<p class="text-lg text-gray-200">{person.position}</p>
					</div>
				</div>
			</div>

			<!-- Content -->
			<div class="max-h-[calc(90vh-140px)] overflow-y-auto p-6">
				<div class="space-y-4">
					<!-- Large Photo -->
					<div class="mb-6 flex justify-center">
						<img
							bind:this={imgLarge}
							src={photoSrc}
							alt={person.name}
							class="h-60 w-48 rounded-lg object-cover shadow-lg"
							onerror={() => {}}
						/>
					</div>

					<!-- Biography -->
					<div>
						<h3 class="mb-3 text-xl font-semibold text-gray-800">Биография</h3>
						<p class="text-justify leading-relaxed whitespace-pre-line text-gray-600">
							{person.biography}
						</p>
					</div>
				</div>
			</div>

			<!-- Footer -->
			<div class="border-t bg-gray-50 px-6 py-4">
				<div class="flex justify-end">
					<button
						onclick={closePopup}
						class="rounded-lg bg-slate-600 px-6 py-2 font-medium text-white transition-colors hover:bg-slate-700"
					>
						Закрыть
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Custom scrollbar */
	:global(.overflow-y-auto::-webkit-scrollbar) {
		width: 6px;
	}
	:global(.overflow-y-auto::-webkit-scrollbar-track) {
		background: #f1f5f9;
	}
	:global(.overflow-y-auto::-webkit-scrollbar-thumb) {
		background: #cbd5e1;
		border-radius: 3px;
	}
	:global(.overflow-y-auto::-webkit-scrollbar-thumb:hover) {
		background: #94a3b8;
	}
</style>
