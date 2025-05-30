<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';

	// ⚠️ Client‑side only — *not* secure for production!
	const USERNAME = 'aki';
	const PASSWORD = 'aki2025test';

	let authenticated = false;

	// If we already have a valid session, skip prompts.
	if (typeof localStorage !== 'undefined' && localStorage.getItem('auth') === 'true') {
		authenticated = true;
	} else {
		// Otherwise, ask once at mount; a correct login triggers a hard reload so the blue prompt chrome disappears.
		onMount(() => {
			const user = prompt('Username:');
			if (user === USERNAME) {
				const pass = prompt('Password:');
				if (pass === PASSWORD) {
					localStorage.setItem('auth', 'true');
					// 🔄 Refresh the page so no prompt remains visible (and picks up the authenticated state)
					location.reload();
				}
			}
			// Any cancel / wrong entry results in no content rendered.
		});
	}

	// Slot support (Svelte 5 render function)
	let { children } = $props();
</script>

{#if authenticated}
	{@render children()}
{:else}
	<div
		class="lock-screen flex h-[100vh] w-full items-center justify-center"
		style="font-size:100px"
		aria-label="Locked – authentication required"
	>
		🔒
	</div>
{/if}

<!-- No visible markup when unauthenticated -->
