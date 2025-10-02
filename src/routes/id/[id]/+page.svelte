<script lang="ts">
	import { base } from '$app/paths';

	// данные

	import { type OtherTypeMode, type EndedMode } from '$lib/aggEvents';

	// utils
	import { staffFallback } from '$lib/utils/images';

	// новые компоненты

	/* ---------- состояние ---------- */
	let BaseInfoOpen = false;
	let financeYear: 2024 | 2025 = 2024;

	let onlyMainStage = true;
	let otherMode: OtherTypeMode = 'exclude';
	let groupMode: 'year' | 'season' = 'year';
	let selectedSeason: number | null = null;
	let endedMode: EndedMode = 'all';

	// картинка-пути
	const theaterimg = (file: string) => `${base}/theaters/${file}_1.jpg`;
	const spaceimg = (file: string) => `${base}/spaces/${file}.jpg`;
	const productionimg = (file: string) => `${base}/productions/${file}.jpg`;
	const hrimg = (file: string) => `${base}/hr/${file}`;
	const socialsimg = (file: string) => `${base}/socials/${file}`;
	const getStaffPhoto = (file?: string | null) => (file ? hrimg(file) : staffFallback);

	// выбрать театр по url

	// сезоны

	function keyOf(e: { title: string; hall: string }) {
		return `${e.title}__${e.hall}`;
	}

	function pctDelta(cur?: number, prev?: number | null) {
		return typeof cur === 'number' && typeof prev === 'number' && isFinite(prev) && prev !== 0
			? (cur - prev) / prev
			: null;
	}

	// сортировка (текущий ключ/направление храним тут, таблица только читает)
	type SortKey =
		| 'sales'
		| 'salesPerShow'
		| 'tickets'
		| 'avgPrice'
		| 'seances'
		| 'occupancy'
		| 'share';
	let sortBy: SortKey = 'sales';
	let sortDir: 'desc' | 'asc' = 'desc';
	function valueForSort(row: any, key: SortKey) {
		const v = row[key];
		if (v == null || Number.isNaN(v)) return -Infinity;
		return v;
	}

	// попап с биографией
	let showPopup = false;
	let selectedPerson = {
		name: 'Жуков Владимир Иванович',
		position: 'Директор',
		photo: 'path/to/photo.jpg',
		biography: 'Биография ...'
	};

	function handleOpenPerson(e: CustomEvent) {
		selectedPerson = e.detail;
		showPopup = true;
	}

	const goToMain = () => {
		window.location.href = '/';
	};

	// ===== helpers для дат (локально) =====
	function _pick(obj: any, keys: string[]) {
		return keys.find((k) => obj[k] != null) ? obj[keys.find((k) => obj[k] != null)!] : undefined;
	}
	function _parseMaybeDate(input: any): Date | null {
		if (input == null) return null;
		if (input instanceof Date) return input;
		if (typeof input === 'number') return new Date(input);
		if (typeof input === 'string') {
			const d1 = new Date(input);
			if (!Number.isNaN(+d1)) return d1;

			const m = input.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})(?:[ T](\d{1,2}):(\d{2}))?$/);
			if (m) {
				const [, dd, mm, yyyy, hh, mi] = m;
				const year = (yyyy.length === 2 ? 2000 + Number(yyyy) : Number(yyyy)) || 0;
				const date = new Date(
					year,
					Number(mm) - 1,
					Number(dd),
					hh ? Number(hh) : 0,
					mi ? Number(mi) : 0
				);
				if (!Number.isNaN(+date)) return date;
			}
		}
		return null;
	}
	function _dateFromRow(r: any): Date | null {
		let dtLike =
			_pick(r, [
				'datetime',
				'dateTime',
				'date_time',
				'dt',
				'start',
				'startAt',
				'start_at',
				'startDateTime',
				'start_datetime',
				'when'
			]) ?? r.date;

		let timeLike = _pick(r, [
			'time',
			'startTime',
			'start_time',
			'showTime',
			'performanceTime',
			'sessionTime'
		]);

		let d = _parseMaybeDate(dtLike);
		if (d) return d;

		if (r.date && timeLike) {
			const base = _parseMaybeDate(r.date);
			if (base) {
				const [h, m] = String(timeLike).split(':').map(Number);
				if (!Number.isNaN(h)) base.setHours(h, Number.isNaN(m) ? 0 : m);
				return base;
			}
		}
		const ts = _pick(r, ['ts', 'timestamp']);
		return _parseMaybeDate(ts);
	}
	const fmtDate = (d: Date | null, fallback = '—') =>
		d ? d.toLocaleDateString('ru-RU') : fallback;
	const fmtTime = (d: Date | null, fallback = '—') =>
		d ? d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : fallback;
</script>

<div class="flex min-h-screen w-full flex-col items-center">
	<div class="w-full bg-slate-900 text-white">
		<header class="mx-auto w-full max-w-6xl p-6 pt-25"></header>
	</div>

	<!-- контент -->
	<div class="w-full bg-slate-900 text-white">
		<section class="mx-auto w-full max-w-6xl p-6"></section>

		<section class="mx-auto w-full max-w-6xl p-6">
			<h2 class="mb-8 text-3xl font-bold">КАЛЕНДАРЬ ПРЕМЬЕР</h2>
		</section>

		<section class="mx-auto w-full max-w-6xl p-6">
			<h2 class="mb-8 text-3xl font-bold">Общая информация</h2>
		</section>

		<section class="mx-auto w-full max-w-6xl p-6">
			<h2 class="mb-8 text-3xl font-bold">Данные по спектаклям</h2>
		</section>
	</div>

	<button class="back-to-main-btn" onclick={goToMain} aria-label="Back to main"> </button>
</div>

<style>
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
</style>
