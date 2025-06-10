<script lang="ts">
	import { BarChart2 } from 'lucide-svelte';
	import '../app.css';

	let showPdf = $state(false);

	const pdfFilename = 'Sales_27.05.pdf';

	// PDF URL with sidebar hidden
	let pdfUrl = $derived(`/${pdfFilename}#toolbar=0&navpanes=0&scrollbar=0`);

	const togglePdf = () => {
		showPdf = !showPdf;
	};

	// Svelte 5 children slot support
	let { children } = $props();
</script>

{@render children()}

<!-- Floating action button -->
<!-- <button class="fab" onclick={togglePdf} aria-label="Show statistics PDF">
	<BarChart2 size={24} />
</button> -->

{#if showPdf}
	<!-- Modal / backdrop -->
	<div class="modal-backdrop" onclick={togglePdf} role="button" tabindex="0"></div>
	<div class="modal" role="dialog" aria-modal="true" aria-label="Statistics PDF">
		<button class="close" onclick={togglePdf} aria-label="Close">✕</button>
		<iframe class="pdf-frame" src={pdfUrl} title="Statistics"></iframe>
	</div>
{/if}

<style>
	.fab {
		position: fixed;
		right: 1.5rem;
		bottom: 1.5rem;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: #2563eb; /* tailwind blue-600 */
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
		cursor: pointer;
		transition: transform 0.15s ease;
		border: none;
		outline: none;
	}
	.fab:hover {
		transform: scale(1.08);
	}
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 40;
		cursor: pointer;
	}
	.modal {
		position: fixed;
		top: 5%;
		left: 5%;
		width: 90%;
		height: 90%;
		background: #fff;
		border-radius: 0.5rem;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		z-index: 50;
	}
	.close {
		align-self: flex-end;
		margin: 0.5rem 0.75rem 0 0;
		background: transparent;
		border: none;
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
	}
	.pdf-frame {
		flex: 1;
		width: 100%;
		border: none;
	}
	.lock-screen {
		color: #888;
		user-select: none;
	}
</style>
