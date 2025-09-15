<script lang="ts">
	import HorizontalBarChart from '$lib/HorizontalBarChart.svelte';
	export let financeYear: number;
	export let offbudgetData: any[] = [];
	export let expenseData: any[] = [];
</script>

<section class="mx-auto w-full max-w-6xl">
	<h2 class="mb-8 text-3xl font-bold">Внебюджет — {financeYear}</h2>
	<HorizontalBarChart items={offbudgetData} />

	<h2 class="mt-10 mb-8 text-3xl font-bold">Расходы</h2>
	<HorizontalBarChart items={expenseData} />
</section>
