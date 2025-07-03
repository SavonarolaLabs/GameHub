<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let isOpen = false;
	export let person: {
		name: string;
		position: string;
		photo: string;
		biography: string;
	} = {
		name: 'Иванов Александр Петрович',
		position: 'Художественный руководитель',
		photo: 'https://via.placeholder.com/200x250/4A5568/FFFFFF?text=Фото',
		biography:
			'Заслуженный артист Российской Федерации, выпускник Московского государственного института культуры. Начал свою карьеру в 1995 году в Московском академическом театре. За время работы поставил более 40 спектаклей, включая классические произведения русской и зарубежной драматургии. Лауреат премии "Золотая маска" за лучшую режиссуру драматического спектакля. Под его руководством театр получил множество престижных наград и признание критиков. Активно занимается педагогической деятельностью, преподает в Театральном институте имени Б. Щукина. Автор методических пособий по театральному искусству и статей в профессиональных изданиях.'
	};

	const dispatch = createEventDispatcher();

	function closePopup() {
		isOpen = false;
		dispatch('close');
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closePopup();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closePopup();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<!-- Backdrop -->
	<div
		class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-[#0009] p-4"
		on:click={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="popup-title"
	>
		<!-- Modal -->
		<div class="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-2xl">
			<!-- Header -->
			<div class="relative bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
				<button
					on:click={closePopup}
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
					<!-- Photo -->
					<div class="flex-shrink-0">
						<img
							src={person.photo}
							alt={person.name}
							class="h-24 w-20 rounded-lg border-2 border-white object-cover shadow-lg"
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
							src={person.photo}
							alt={person.name}
							class="h-60 w-48 rounded-lg object-cover shadow-lg"
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
						on:click={closePopup}
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
