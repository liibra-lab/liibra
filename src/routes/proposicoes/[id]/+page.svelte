<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	import { t } from '$lib/i18n';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import PropositionMeta from '$lib/components/PropositionMeta.svelte';
	import SourceAttribution from '$lib/components/SourceAttribution.svelte';

	let { data }: { data: PageData } = $props();

	let m = $derived(t(data.locale));
	let locale = $derived(data.locale);
	let p = $derived(data.proposition);
	let label = $derived(`${p.siglaTipo} ${p.numero}/${p.ano}`);
</script>

<svelte:head>
	<title>{label} · {m.brand}</title>
	{#if p.ementa}<meta name="description" content={p.ementa} />{/if}

	<meta property="og:title" content={label} />
	{#if p.ementa}<meta property="og:description" content={p.ementa} />{/if}
	<meta property="og:type" content="article" />

	<meta name="twitter:title" content={label} />
	{#if p.ementa}<meta name="twitter:description" content={p.ementa} />{/if}
</svelte:head>

<Breadcrumbs
	items={[
		{ label: m.nav_home, href: resolve('/') },
		{ label: m.prop_browse_title, href: resolve('/proposicoes') },
		{ label }
	]}
/>

<div class="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_16rem]">
	<article class="min-w-0 max-w-prose">
		<header class="border-b border-liibra-rule pb-6">
			<h1 class="text-3xl leading-tight">{label}</h1>
			<div class="mt-4">
				<PropositionMeta proposition={p} {m} {locale} />
			</div>
		</header>

		<div class="mt-8 space-y-6">
			{#if p.ementa}
				<section>
					<h2 class="text-lg font-semibold">{m.prop_ementa}</h2>
					<p class="mt-1 whitespace-pre-line">{p.ementa}</p>
				</section>
			{/if}

			{#if p.ementaDetalhada}
				<section>
					<h2 class="text-lg font-semibold">{m.prop_ementa_detalhada}</h2>
					<p class="mt-1 whitespace-pre-line">{p.ementaDetalhada}</p>
				</section>
			{/if}

			{#if data.authors.length > 0}
				<section>
					<h2 class="text-lg font-semibold">{m.prop_authors}</h2>
					<ul class="mt-1 list-disc pl-5">
						{#each data.authors as author, i (i)}
							<li>{author.nome}{author.tipo ? ` (${author.tipo})` : ''}</li>
						{/each}
					</ul>
				</section>
			{/if}

			{#if p.keywords}
				<section>
					<h2 class="text-lg font-semibold">{m.prop_keywords}</h2>
					<p class="mt-1 text-sm text-liibra-muted">{p.keywords}</p>
				</section>
			{/if}
		</div>
	</article>

	<aside class="order-first lg:order-last">
		<SourceAttribution provenance={data.provenance} {m} {locale} />
	</aside>
</div>
