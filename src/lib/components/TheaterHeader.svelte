<script lang="ts">
	import { titleCase } from '$lib/utils/format';
	export let theater: any;
	export let rank: any | null;
	export let operators: { name: string }[] = [];
	export let socials: { link: string; photo: string }[] = [];
	export let theaterimg: (file: string) => string;
	export let socialsimg: (file: string) => string;
</script>

<div class="flex flex-col justify-between lg:flex-row">
	<!-- left -->
	<div class="flex-1">
		<h1 class="mb-4 text-4xl font-bold">{theater.name}</h1>

		<div class="mb-2 flex flex-col">
			{#if operators.length}
				<div class="flex flex-wrap gap-4 whitespace-nowrap">
					{#each operators as op}
						<div class="rounded-sm bg-slate-700 px-3">{op.name}</div>
					{/each}
				</div>
			{/if}
		</div>

		<div class="mt-4 mb-8 line-clamp-4 opacity-[0.7]">{theater.description}</div>
		<p class="mb-2 text-gray-400">{theater.address}</p>

		<div class="flex flex-wrap items-center justify-between">
			<div>
				{#if socials.length}
					<div class="top-16 my-4 flex gap-4">
						{#each socials as social}
							<a target="_blank" href={social.link}>
								<img class="size-6" src={socialsimg(social.photo)} alt="" />
							</a>
						{/each}
					</div>
				{/if}
			</div>
			<div>
				<div class="rounded-full border-2 px-3 text-slate-700">
					{theater.reconstruction}
				</div>
			</div>
		</div>
	</div>

	<!-- right -->
	<div class="mt-8 w-full lg:mt-0 lg:ml-8 lg:w-80">
		<div class="mb-4 rounded-lg bg-slate-800 p-4">
			{#if rank}
				<div class="font-bold text-[#f03066]">
					#{rank.rankRevenue2025}
					<span class="text-gray-300">по выручке</span>
				</div>
				<div class="font-bold text-[#f03066]">
					#{rank.rankTickets2025}
					<span class="text-gray-300">по посещаемости</span>
				</div>
			{/if}
		</div>

		<div class="mb-4 overflow-hidden rounded-lg bg-slate-800">
			<img class="h-48 w-full object-cover" src={theaterimg(theater.id)} alt={theater.name} />
		</div>

		<div
			class="transition-color flex w-full items-center justify-between rounded bg-slate-700 px-4 py-3 text-left"
		>
			<div class="inline-block rounded bg-[#f03066] px-2 py-1 text-sm font-bold text-white">
				★ {theater.yandex_rating}
			</div>
			<p>Отзывы: {theater.yandex_reviews_count}</p>
			<p>Оценки: {theater.yandex_ratings_count}</p>
		</div>
	</div>
</div>
