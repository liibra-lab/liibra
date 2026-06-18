<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	import { t, documentTypeLabel } from '$lib/i18n';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import DocumentMeta from '$lib/components/DocumentMeta.svelte';
	import ArticleList from '$lib/components/ArticleList.svelte';
	import TOCsidebar from '$lib/components/TOCsidebar.svelte';

	let { data }: { data: PageData } = $props();

	let m = $derived(t(data.locale));
	let locale = $derived(data.locale);
	let doc = $derived(data.document);
	let title = $derived(locale === 'en' && doc.title.en ? doc.title.en : doc.title.pt);
	let short = $derived(locale === 'en' && doc.shortTitle?.en ? doc.shortTitle.en : doc.shortTitle?.pt);
	let summary = $derived(locale === 'en' && doc.summary?.en ? doc.summary.en : doc.summary?.pt);
</script>

<svelte:head>
	<title>{short ?? title} · {m.brand}</title>
	{#if summary}<meta name="description" content={summary} />{/if}
</svelte:head>

<Breadcrumbs
	items={[
		{ label: m.nav_home, href: resolve('/') },
		{ label: documentTypeLabel(locale, doc.type) },
		{ label: short ?? doc.number }
	]}
/>

<div class="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_14rem]">
	<article class="min-w-0 max-w-prose">
		<header class="border-b border-liibra-rule pb-6">
			<h1 class="text-3xl leading-tight">{title}</h1>
			{#if summary}
				<p class="mt-3 text-liibra-muted">{summary}</p>
			{/if}
			<div class="mt-4">
				<DocumentMeta {doc} {m} {locale} />
			</div>
		</header>

		{#if doc.coverage === 'partial'}
			<p
				role="note"
				class="mt-6 rounded-md border border-liibra-rule bg-liibra-surface px-4 py-3 text-sm text-liibra-muted"
			>
				{m.doc_partial_notice}
			</p>
		{/if}

		<div class="mt-8">
			<ArticleList articles={doc.articles} {m} />
		</div>
	</article>

	<aside class="order-first lg:order-last">
		<TOCsidebar articles={doc.articles} {m} />
	</aside>
</div>
