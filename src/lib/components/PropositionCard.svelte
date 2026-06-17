<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PropositionSummary } from '$lib/server/camara';

	let { proposition }: { proposition: PropositionSummary } = $props();

	let href = $derived(resolve('/proposicoes/[id]', { id: String(proposition.id) }));
	let label = $derived(`${proposition.siglaTipo} ${proposition.numero}/${proposition.ano}`);
</script>

<article class="border-b border-liibra-rule py-4">
	<p class="text-xs uppercase tracking-wide text-liibra-muted">{label}</p>
	<h3 class="mt-1 text-lg">
		<a {href} class="font-serif">{label}</a>
	</h3>
	{#if proposition.ementa}
		<p class="mt-1 text-sm text-liibra-muted">{proposition.ementa}</p>
	{/if}
</article>
