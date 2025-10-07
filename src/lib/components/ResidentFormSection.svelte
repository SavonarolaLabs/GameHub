<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let fio = '';
	let email = '';
	let inn = '';
	let message = '';

	let touched = { fio: false, email: false, inn: false };
	const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const innRe = /^(?:\d{10}|\d{12})$/;

	$: errors = {
		fio: touched.fio && fio.trim().length < 3 ? 'Укажите ФИО полностью' : '',
		email: touched.email && !emailRe.test(email) ? 'Некорректный email' : '',
		inn: touched.inn && inn && !innRe.test(inn) ? 'ИНН: 10 или 12 цифр' : ''
	};

	function onSubmit(e: Event) {
		e.preventDefault();
		touched = { fio: true, email: true, inn: inn.length > 0 };
		const hasError = Object.values(errors).some(Boolean);
		if (hasError) return;

		// TODO: замените на ваш submit (fetch('/api/resident', {method:'POST', body:...}))
		dispatch('submit', { fio, email, inn, message });
		alert('Заявка отправлена (демо).');
		fio = email = inn = message = '';
		touched = { fio: false, email: false, inn: false };
	}
</script>

<section class="relative overflow-hidden py-16 md:py-24">
	<!-- фон -->
	<div class="absolute inset-0 -z-10 bg-gradient-to-b from-[#0b0f14] via-[#0b0f14] to-[#0a0e12]" />
	<div class="pointer-events-none absolute inset-0 -z-10">
		<!-- мягкие «шары» -->
		<div
			class="absolute top-10 -left-24 h-72 w-72 rounded-full blur-3xl"
			style="background: radial-gradient(55% 55% at 50% 50%, #ffb86b55 0%, #0000 70%);"
		/>
		<div
			class="absolute -top-12 right-10 h-64 w-64 rounded-full blur-3xl"
			style="background: radial-gradient(55% 55% at 50% 50%, #6ea8ff44 0%, #0000 70%);"
		/>
		<div
			class="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full blur-[70px]"
			style="background: radial-gradient(55% 55% at 50% 50%, #9b59b655 0%, #0000 70%);"
		/>
	</div>

	<div class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2">
		<!-- слева — иллюстрация (можете заменить) -->
		<div class="order-2 md:order-1">
			<div
				class="relative mx-auto aspect-square max-w-[520px] overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
			>
				<div
					class="absolute inset-0 rounded-3xl bg-[radial-gradient(125%_80%_at_10%_10%,#ffffff0d_0%,#0000_60%)]"
				/>
				<img
					src="/images/forma.png"
					alt="Gamepad"
					class="relative z-[1] h-full w-full object-contain"
					loading="lazy"
					decoding="async"
					on:error={(e) => (e.currentTarget.style.display = 'none')}
				/>
			</div>
		</div>

		<!-- справа — форма -->
		<div class="order-1 md:order-2">
			<h2
				class="mb-6 text-center text-3xl font-extrabold tracking-tight text-white md:text-left md:text-5xl"
			>
				Стать резидентом
			</h2>

			<form class="space-y-5" on:submit={onSubmit}>
				<!-- ФИО -->
				<div>
					<label class="mb-1 block text-sm font-medium text-slate-200">ФИО</label>
					<input
						class="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white backdrop-blur outline-none placeholder:text-slate-400 focus:border-white/40"
						type="text"
						bind:value={fio}
						on:blur={() => (touched.fio = true)}
						placeholder="Иванов Иван Иванович"
						required
					/>
					{#if errors.fio}<p class="mt-1 text-xs text-rose-400">{errors.fio}</p>{/if}
				</div>

				<!-- Email + ИНН -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label class="mb-1 block text-sm font-medium text-slate-200">Email</label>
						<input
							class="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white backdrop-blur outline-none placeholder:text-slate-400 focus:border-white/40"
							type="email"
							bind:value={email}
							on:blur={() => (touched.email = true)}
							placeholder="name@example.com"
							required
						/>
						{#if errors.email}<p class="mt-1 text-xs text-rose-400">{errors.email}</p>{/if}
					</div>

					<div>
						<label class="mb-1 block text-sm font-medium text-slate-200">ИНН (необязательно)</label>
						<input
							class="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white backdrop-blur outline-none placeholder:text-slate-400 focus:border-white/40"
							type="text"
							bind:value={inn}
							on:blur={() => (touched.inn = true)}
							inputmode="numeric"
							pattern="\d{10}|\d{12}"
							placeholder="10 или 12 цифр"
						/>
						{#if errors.inn}<p class="mt-1 text-xs text-rose-400">{errors.inn}</p>{/if}
					</div>
				</div>

				<!-- Сообщение -->
				<div>
					<label class="mb-1 block text-sm font-medium text-slate-200">Сообщение</label>
					<textarea
						class="min-h-[120px] w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white backdrop-blur outline-none placeholder:text-slate-400 focus:border-white/40"
						bind:value={message}
						placeholder="Коротко о команде, проекте и запросе к кластеру"
					/>
				</div>

				<!-- Кнопки -->
				<div class="mt-6 flex flex-wrap gap-4">
					<button
						type="button"
						class="group rounded-full border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/10"
						on:click={() => {
							fio = '';
							email = '';
							inn = '';
							message = '';
							touched = { fio: false, email: false, inn: false };
						}}
					>
						Сохранить черновик
					</button>

					<button
						type="submit"
						class="relative rounded-full px-8 py-3 font-semibold text-white transition"
						style="background: radial-gradient(120% 120% at 10% 10%, #ffb86b 0%, #a78bfa 45%, #2563eb 90%);"
					>
						<span class="relative z-[1]">Отправить заявку</span>
						<span
							class="absolute inset-0 -z-0 rounded-full opacity-40 blur-xl"
							style="background: radial-gradient(120% 120% at 20% 20%, #ffb86b 0%, #a78bfa 45%, #2563eb 90%);"
						/>
					</button>
				</div>
			</form>
		</div>
	</div>
</section>
