<script lang="ts">
	import { base } from '$app/paths';
	import { MapPin, Phone, Mail } from 'lucide-svelte';

	// простая форма без отправки на бэкенд (можно заменить на fetch позже)
	let email = '';
	let question = '';

	function submit(e: Event) {
		e.preventDefault();
		// mailto как временная «отправка»
		const to = 'aki.info@culture.mos.ru';
		const subject = encodeURIComponent('Вопрос с сайта Кластера видеоигр');
		const body = encodeURIComponent(`Email: ${email}\n\nВопрос:\n${question}`);
		window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
	}
</script>

<footer
	class="relative overflow-hidden border-t border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 text-slate-200"
>
	<!-- мягкий фон -->
	<div
		class="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full blur-3xl"
		style="background: radial-gradient(55% 55% at 50% 50%, #ff7a1a33 0%, #0000 70%);"
	></div>

	<div class="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-3">
		<!-- Левая колонка: лого + мини-форма -->
		<div>
			<div class="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-white">
				<!-- сюда можно поставить <img src={`${base}/images/logo.svg`} .../> -->
				<span class="rounded-lg border border-slate-600/60 px-2 py-1">Логотип</span>
			</div>

			<p class="mb-3 text-sm text-slate-400">Связаться с нами:</p>

			<form class="space-y-2" on:submit={submit}>
				<div class="flex gap-2">
					<input
						type="email"
						placeholder="Почта"
						required
						bind:value={email}
						class="w-full rounded-md border border-white/15 bg-white/[0.06] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-400 focus:border-white/30"
					/>
					<button
						type="submit"
						class="rounded-md border border-white/20 bg-white/[0.08] px-4 py-2 text-sm font-semibold whitespace-nowrap text-white transition hover:bg-white/[0.14]"
					>
						Отправить
					</button>
				</div>

				<textarea
					rows="3"
					placeholder="Ваш вопрос:"
					bind:value={question}
					class="w-full rounded-md border border-white/15 bg-white/[0.06] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-400 focus:border-white/30"
				/>
			</form>
		</div>

		<!-- Средняя колонка: навигация -->
		<nav>
			<h4 class="mb-3 text-sm font-semibold text-white">Информация</h4>
			<ul class="space-y-2 text-sm">
				<li><a class="hover:underline" href={`${base}/about`}>О нас</a></li>
				<li><a class="hover:underline" href={`${base}/infrastructure`}>Инфраструктура</a></li>
				<li><a class="hover:underline" href={`${base}/programs`}>Программы</a></li>
				<li><a class="hover:underline" href={`${base}/events`}>Мероприятия</a></li>
				<li><a class="hover:underline" href={`${base}/library`}>Библиотека</a></li>
			</ul>
		</nav>

		<!-- Правая колонка: контакты -->
		<div>
			<h4 class="mb-3 text-sm font-semibold text-white">Контакты</h4>
			<ul class="space-y-3 text-sm">
				<li class="flex items-start gap-2 text-slate-300">
					<MapPin size={16} class="mt-0.5 opacity-80" />
					<span>Инновационный центр Сколково, Москва,<br /> ул. Николы Теслы 1с1</span>
				</li>
				<li class="flex items-center gap-2 text-slate-300">
					<Phone size={16} class="opacity-80" />
					<a class="hover:underline" href="tel:+74959883080">+7 495 988 30 80</a>
				</li>
				<li class="flex items-center gap-2 text-slate-300">
					<Mail size={16} class="opacity-80" />
					<a class="hover:underline" href="mailto:aki.info@culture.mos.ru"
						>aki.info@culture.mos.ru</a
					>
				</li>
			</ul>
		</div>
	</div>

	<div class="border-t border-slate-800/80">
		<div
			class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-xs text-slate-400"
		>
			<span>© {new Date().getFullYear()} Кластер видеоигр</span>
			<a class="hover:underline" href={`${base}/privacy`}>Политика конфиденциальности</a>
		</div>
	</div>
</footer>
