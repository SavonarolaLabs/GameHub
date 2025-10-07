<script lang="ts">
	import { base } from '$app/paths';

	export let title: string = 'Moscow game hub';
	export let subtitle: string = 'Экосистема для создания игр: площадки, программы, сообщество.';
	export let ctaText: string = 'Связаться с нами';
	// сделай ссылку на вашу форму/почту
	export let ctaHref: string = `${base}/contact`; // либо: 'mailto:hello@gamehub.ru'
	export let imageSrc: string = `${base}/images/hero-gamepad.png`; // положи файл в /static/images/
	export let imageAlt: string = 'Игровой контроллер';
</script>

<section class="relative overflow-hidden">
	<!-- фон -->
	<div class="absolute inset-0 -z-10">
		<div class="h-full w-full bg-gradient-to-b from-slate-900 to-slate-950"></div>
		<div
			class="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_60%_at_60%_30%,#0000,black)] opacity-60"
		>
			<div
				class="absolute -top-24 -right-24 h-80 w-80 rounded-full blur-3xl"
				style="background: radial-gradient(60% 60% at 50% 50%, #fb923c44 0%, #0000 70%);"
			></div>
			<div
				class="absolute bottom-8 left-8 h-72 w-72 rounded-full blur-3xl"
				style="background: radial-gradient(60% 60% at 50% 50%, #22d3ee33 0%, #0000 70%);"
			></div>
		</div>
	</div>

	<div
		class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-2 md:gap-8 lg:py-24"
	>
		<!-- текстовая колонка -->
		<div class="text-center md:text-left">
			<h1 class="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
				{title}
			</h1>
			<p class="mx-auto max-w-2xl text-slate-300 md:text-lg">
				{subtitle}
			</p>

			<div class="mt-8 flex items-center justify-center gap-4 md:justify-start">
				<a
					href={ctaHref}
					class="inline-flex items-center justify-center rounded-xl border border-slate-600/60 bg-white/5 px-5 py-3 text-base font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur transition hover:bg-white/10"
				>
					{ctaText}
				</a>
			</div>
		</div>

		<!-- картинка -->
		<div class="relative">
			<img
				src={imageSrc}
				alt={imageAlt}
				width="900"
				height="700"
				class="mx-auto block max-h-[420px] w-auto rounded-2xl border border-white/5 bg-white/2 object-contain shadow-2xl select-none"
				loading="eager"
				decoding="async"
			/>
			<!-- мягкая тень под картинкой -->
			<div
				class="pointer-events-none absolute inset-x-10 -bottom-6 h-10 rounded-full bg-black/50 blur-2xl"
			></div>
		</div>
	</div>
</section>
