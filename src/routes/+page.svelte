<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	import { t, documentTypeLabel } from '$lib/i18n';
	import SearchBox from '$lib/components/SearchBox.svelte';
	import liibraLogo from '$lib/assets/liibra-logo.svg';

	let { data }: { data: PageData } = $props();

	let m = $derived(t(data.locale));
	let locale = $derived(data.locale);
</script>

<svelte:head>
	<title>{m.brand} — {m.tagline}</title>
	<meta name="description" content={m.hero_subtitle} />
</svelte:head>

<section class="border-b border-liibra-rule pb-10 text-center">
	<img src={liibraLogo} alt={m.brand} class="mx-auto mb-6 h-28 w-auto sm:h-32" />
	<h1 class="text-4xl font-bold tracking-tight sm:text-5xl">{m.hero_title}</h1>
	<p class="mx-auto mt-3 max-w-2xl text-lg text-liibra-muted">{m.hero_subtitle}</p>
	<div class="mx-auto mt-8 max-w-2xl">
		<SearchBox {m} variant="hero" />
	</div>
</section>

<section class="mt-10">
	<h2 class="text-2xl">{m.browse_title}</h2>
	<ul class="mt-4 divide-y divide-liibra-rule">
		{#each data.documents as doc (doc.urn)}
			{@const title = locale === 'en' && doc.title.en ? doc.title.en : doc.title.pt}
			{@const short = locale === 'en' && doc.shortTitle?.en ? doc.shortTitle.en : doc.shortTitle?.pt}
			{@const summary = locale === 'en' && doc.summary?.en ? doc.summary.en : doc.summary?.pt}
			<li class="py-4">
				<p class="text-xs uppercase tracking-wide text-liibra-muted">
					{documentTypeLabel(locale, doc.type)} · {doc.number}
				</p>
				<h3 class="mt-1 text-lg">
					<a href={resolve('/doc/[...urn]', { urn: doc.urn })} class="font-serif">{short ?? title}</a>
				</h3>
				{#if summary}
					<p class="mt-1 text-sm text-liibra-muted">{summary}</p>
				{/if}
			</li>
		{/each}
	</ul>
</section>
