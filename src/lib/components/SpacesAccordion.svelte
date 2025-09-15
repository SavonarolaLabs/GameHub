<script lang="ts">
	import { titleCase, joinTitleCase, safeHref } from '$lib/utils/format';
	import { onImgError, spaceFallback } from '$lib/utils/images';

	export let spaces: any[] = [];
	export let spaceimg: (file: string) => string;

	let expanded = -1;
</script>

<h2 class="mb-6 text-2xl font-bold">
	{spaces.length} площадки / {spaces.reduce((s, v) => s + (v.total_capacity ?? 0), 0)} мест
</h2>

{#each spaces as s, i}
	<div class="mb-6 rounded-lg bg-slate-700">
		<button
			class="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-600"
			onclick={() => (expanded = expanded === i ? -1 : i)}
		>
			<span class="text-xl font-semibold">{s.venue_space_short_name} / {s.total_capacity} мест</span
			>
			<svg
				class="h-6 w-6 transition-transform duration-300 {expanded === i ? 'rotate-180' : ''}"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		{#if expanded === i}
			<div class="bg-slate-750 p-6">
				<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<div>
						<p class="mb-4">
							<span class="text-sm text-gray-400">Тип:</span> <span>{s.type}</span>
						</p>
						<p class="mb-4">
							<span class="text-sm text-gray-400">Жанр:</span>
							<span>{titleCase(s.genre, '—')}</span>
						</p>
						<p class="mb-4">
							<span class="text-sm text-gray-400">Округ / район:</span>
							{joinTitleCase([s.okrug, s.district])}
						</p>
						<p class="mb-4">
							<span class="text-sm text-gray-400">Адресс:</span>
							<span>{titleCase(s.address, '—')}</span>
						</p>

						{#if s.metro}
							<p class="mb-4">
								<span class="text-sm text-gray-400">Метро:</span>
								<span
									>{s.metro}{#if s.metro_walk_min != null}
										· {s.metro_walk_min} мин пешком{/if}</span
								>
							</p>
						{/if}

						<div class="mt-2 flex flex-wrap gap-2">
							{#if s.has_cafe === true}<span class="rounded bg-slate-600 px-2 py-0.5 text-xs"
									>Кафе</span
								>{/if}
							{#if s.has_buffet === true}<span class="rounded bg-slate-600 px-2 py-0.5 text-xs"
									>Буфет</span
								>{/if}
							{#if s.has_souvenir_shop === true}<span
									class="rounded bg-slate-600 px-2 py-0.5 text-xs">Сувениры</span
								>{/if}
						</div>

						{#if safeHref(s.maps_link)}
							<a
								class="mb-6 inline-block text-blue-400 underline"
								href={s.maps_link}
								target="_blank"
								rel="noopener">Открыть в&nbsp;Яндекс.Картах</a
							>
						{/if}
					</div>

					<div class="flex h-40 items-center justify-center overflow-hidden rounded bg-slate-600">
						<img
							class="h-full w-full object-cover"
							src={s.photo ? spaceimg(s.photo) : spaceFallback}
							alt={s.venue_space_short_name}
							onerror={(e) => onImgError(e, spaceFallback)}
						/>
					</div>
				</div>
			</div>
		{/if}
	</div>
{/each}
