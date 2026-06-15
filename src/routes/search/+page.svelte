<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	import { t, resultsCount } from '$lib/i18n';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import ResultCard from '$lib/components/ResultCard.svelte';

	let { data }: { data: PageData } = $props();

	let m = $derived(t(data.locale));
</script>

<svelte:head>
	<title>{data.query ? `${data.query} — ` : ''}{m.results_title} · {m.brand}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<Breadcrumbs label="breadcrumb" items={[{ label: m.nav_home, href: resolve('/') }, { label: m.results_title }]} />

<h1 class="mt-4 text-3xl">{m.results_title}</h1>

{#if !data.query}
	<p class="mt-4 text-liibra-muted">{m.no_query}</p>
{:else if data.hits.length === 0}
	<p class="mt-4 text-liibra-muted">{m.no_results}</p>
{:else}
	<p class="mt-2 text-sm text-liibra-muted">{resultsCount(data.locale, data.hits.length)}</p>
	<div class="mt-2">
		{#each data.hits as hit (hit.document.urn)}
			<ResultCard {hit} {m} locale={data.locale} />
		{/each}
	</div>
{/if}
