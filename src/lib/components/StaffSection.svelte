<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { titleCase, trimTitles, formatPhone, fmtInt, hasStat, safeHref } from '$lib/utils/format';
	import { onImgError, staffFallback, photobankFallback } from '$lib/utils/images';

	export let open = false;

	export let theater: any;
	export let hrRows: any[] = [];

	// карточки-статы
	export let staffTotal: number | null = null;
	export let staffAdmin: number | null = null;
	export let staffArtistic: number | null = null;
	export let staffArtists: number | null = null;

	export let socialsimg: (file: string) => string;
	export let getStaffPhoto: (file?: string | null) => string;

	const dispatch = createEventDispatcher();

	let artistsOpen = true;

	$: staffCards = [
		{ label: 'СОТРУДНИКИ', value: staffTotal },
		{ label: 'АДМИНИСТРАТИВНЫЙ ПЕРСОНАЛ', value: staffAdmin },
		{ label: 'ХУДОЖЕСТВЕННЫЙ ПЕРСОНАЛ', value: staffArtistic },
		{ label: 'АРТИСТЫ', value: staffArtists }
	].filter((c) => hasStat(c.value));

	function showPersonBio(p: any) {
		dispatch('open-person', {
			name: p.fullName,
			position: p.position,
			photo: getStaffPhoto(p.photo),
			biography: p.biography
		});
	}

	const isBoss = (p: any) => {
		const pos = (p.position || '').toLowerCase();
		return (
			pos === 'директор' ||
			pos.startsWith('художественный руководитель') ||
			pos.startsWith('художественный') ||
			pos.startsWith('генеральный директор')
		); // обратный пробел сохранён
	};
</script>

<!-- Тогглер -->
<button
	class="mt-10 mb-4 flex items-center gap-2 text-xl font-semibold"
	onclick={() => (open = !open)}
>
	Сотрудники
	<svg
		class="h-5 w-5 transition-transform duration-200 {open ? 'rotate-180' : ''}"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
	</svg>
</button>

{#if open}
	{#if staffCards.length}
		<div class="flex flex-wrap justify-between gap-6">
			{#each staffCards as c}
				<h3 class="mt-8 mb-3 flex flex-col-reverse text-lg font-semibold">
					<div class="text-xs tracking-wide text-gray-400 uppercase">{c.label}</div>
					<div class="text-4xl leading-none sm:text-5xl md:text-6xl lg:text-7xl">
						{fmtInt(c.value)}
					</div>
				</h3>
			{/each}
		</div>
	{/if}

	<h3 class="mt-10 mb-4 text-xl font-semibold">РУКОВОДСТВО</h3>
	<div class="grid gap-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
		{#each hrRows.filter((h) => h.organizationInn == theater.id && isBoss(h)) as p}
			<div class="relative h-30">
				<div class="flex items-start space-x-3">
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<img
						class="size-16 cursor-pointer rounded-full"
						src={getStaffPhoto(p.photo)}
						alt=""
						onclick={() => showPersonBio(p)}
						onerror={(e) => onImgError(e, staffFallback)}
					/>
					<div>
						<div class="font-semibold">{titleCase(p.fullName, '—')}</div>
						<div class="text-sm text-gray-400">{titleCase(p.position, '—')}</div>
						<div class="text-sm text-gray-400">{formatPhone(trimTitles(p.phone))}</div>
					</div>
				</div>
				<div class="absolute top-16 flex gap-4">
					{#if p.wikiUrl}
						<a target="_blank" href={p.wikiUrl}
							><img class="size-6" src={socialsimg('wiki.jpg')} alt="" /></a
						>
					{/if}
					{#if p.linkToTheaterSite}
						<a target="_blank" href={p.linkToTheaterSite}
							><img class="size-6" src={socialsimg(theater.id + '_logo.jpg')} alt="" /></a
						>
					{/if}
				</div>
			</div>
		{/each}
	</div>

	<h3 class="mt-10 mb-4 text-xl font-semibold">ПРЕСС-СЛУЖБА</h3>
	<div class="grid gap-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
		{#each hrRows.filter((h) => h.organizationInn == theater.id && (h.position || '').toLowerCase() == 'пресс-служба') as p}
			<div class="relative h-30">
				<div class="flex items-start space-x-3">
					<div>
						<div class="font-semibold">{titleCase(p.fullName)}</div>
						<div class="text-sm text-gray-400">{titleCase(p.position)}</div>
						<div class="text-sm text-gray-400">{formatPhone(trimTitles(p.phone))}</div>
						<div class="text-sm text-gray-400">{trimTitles(p.email)}</div>
					</div>
				</div>
			</div>
		{/each}

		<div class="relative h-30">
			<div class="flex items-start space-x-3">
				{#if safeHref(theater.fotobankLink)}
					<a target="_blank" class="flex flex-col gap-2" href={theater.fotobankLink}>
						<img
							class="size-16 rounded-full"
							src={socialsimg(theater.id + '_logo.jpg')}
							alt="Фотобанк"
							onerror={(e) => onImgError(e, photobankFallback)}
						/>
						<div><div class="text-sm text-gray-400">Фотобанк</div></div>
					</a>
				{:else}
					<div
						class="flex cursor-not-allowed flex-col gap-2 opacity-70"
						title="Ссылка на фотобанк не указана"
					>
						<img
							class="size-16 rounded-full"
							src={photobankFallback}
							alt="Фотобанк"
							onerror={(e) => onImgError(e, photobankFallback)}
						/>
						<div><div class="text-sm text-gray-400">Фотобанк</div></div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- АРТИСТЫ -->
	<button
		class="mt-10 mb-4 flex items-center gap-2 text-xl font-semibold"
		onclick={() => (artistsOpen = !artistsOpen)}
	>
		АРТИСТЫ
		<svg
			class="h-5 w-5 transition-transform duration-200 {artistsOpen ? 'rotate-180' : ''}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>
	{#if artistsOpen}
		<div class="grid gap-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
			{#each hrRows.filter((h) => h.organizationInn == theater.id && (h.position || '').toLowerCase() == 'топовые артисты') as p}
				<div class="relative h-30">
					<div class="flex items-start space-x-3">
						<img
							class="size-16 cursor-pointer rounded-full"
							src={getStaffPhoto(p.photo)}
							alt=""
							onclick={() => showPersonBio(p)}
							onerror={(e) => onImgError(e, staffFallback)}
						/>
						<div>
							<div class="font-semibold">{p.fullName}</div>
							<div class="line-clamp-3 text-sm text-gray-400">{p.titles}</div>
						</div>
					</div>
					<div class="absolute top-16 flex gap-4">
						{#if p.wikiUrl}
							<a target="_blank" href={p.wikiUrl}
								><img class="size-6" src={socialsimg('wiki.jpg')} alt="" /></a
							>
						{/if}
						{#if p.linkToTheaterSite}
							<a target="_blank" href={p.linkToTheaterSite}
								><img class="size-6" src={socialsimg(theater.id + '_logo.jpg')} alt="" /></a
							>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
{/if}
