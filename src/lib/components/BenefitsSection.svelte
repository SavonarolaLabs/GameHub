<script lang="ts">
	import { Building2, Percent, Wrench, Globe2, LineChart, GraduationCap } from 'lucide-svelte';

	type Benefit = {
		id: number;
		title: string;
		desc?: string;
		icon: any;
	};

	export let heading: string = 'Стань резидентом — получи все льготы';
	export let benefits: Benefit[] = [
		{
			id: 1,
			title: 'Льготная аренда для резидентов',
			desc: 'Рабочие места, офисы и студии на специальных условиях.',
			icon: Building2
		},
		{
			id: 2,
			title: 'Налоговые льготы для резидентов',
			desc: 'Поддержка при оформлении и сопровождении.',
			icon: Percent
		},
		{
			id: 3,
			title: 'Профильная инфраструктура для разработки игр',
			desc: 'Площадки, оборудование, лаборатории и тестовые стенды.',
			icon: Wrench
		},
		{
			id: 4,
			title: 'Международное продвижение и экспорт',
			desc: 'Выход на зарубежные рынки и выставки.',
			icon: Globe2
		},
		{
			id: 5,
			title: 'Привлечение инвестиций в игры',
			desc: 'Питчи, демо-дни, доступ к фондам и инвесторам.',
			icon: LineChart
		},
		{
			id: 6,
			title: 'Образовательные и акселерационные программы',
			desc: 'Курсы, менторство и интенсивы для команд.',
			icon: GraduationCap
		}
	];
</script>

<section class="relative py-14 md:py-20">
	<div class="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950 to-slate-900"></div>

	<div class="mx-auto max-w-7xl px-6">
		<h2
			class="mb-8 text-center text-3xl font-extrabold tracking-tight text-white md:mb-12 md:text-5xl"
		>
			{heading}
		</h2>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each benefits as b, i}
				<div
					class="group rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:-translate-y-0.5 hover:bg-slate-900 md:p-6"
				>
					<div class="mb-4 flex items-center gap-3">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/70 bg-slate-800/50"
						>
							<svelte:component this={b.icon} size={20} class="opacity-90" />
						</div>

						<span
							class="rounded-md border border-slate-700/70 px-2 py-0.5 text-xs font-semibold tracking-widest text-slate-300"
						>
							{String(b.id).padStart(2, '0')}
						</span>
					</div>

					<h3 class="mb-2 text-lg font-semibold text-white md:text-xl">
						{b.title}
					</h3>
					{#if b.desc}
						<p class="text-sm leading-6 text-slate-400">
							{b.desc}
						</p>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>
