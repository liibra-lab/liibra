<script lang="ts">
	import { onMount } from 'svelte';

	let hydrated = $state(false);
	onMount(() => {
		hydrated = true;
	});
</script>

<svelte:head>
	<title>Liibra</title>
</svelte:head>

<main class="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-950 text-gray-100">
	<h1 class="text-5xl font-bold tracking-tight">Liibra</h1>
	<p class="text-sm text-gray-400">
		SvelteKit on Cloudflare Workers — {hydrated ? 'hydrated' : 'server-rendered'}
	</p>
</main>
