<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Messages } from '$lib/i18n';
	import type { Locale } from '$lib/i18n/locales';
	import { documentCategoryLabel, formatDateTime } from '$lib/i18n';
	import type { LegalSearchResultItem } from '$lib/legal/search-types';

	let { item, m, locale }: { item: LegalSearchResultItem; m: Messages; locale: Locale } = $props();

	// Link internally through Liibra; the existing doc route is URN-addressed.
	let href = $derived(resolve('/doc/[...urn]', { urn: item.urn }));
	let date = $derived(item.date ? formatDateTime(locale, item.date) : '');
</script>

<article class="border-b border-liibra-rule py-4">
	<p class="text-xs uppercase tracking-wide text-liibra-muted">
		{#if item.category}{documentCategoryLabel(locale, item.category)}{/if}
		{#if item.category && date} · {/if}
		{#if date}{date}{/if}
	</p>
	<h3 class="mt-1 text-lg">
		<a {href} class="font-serif">{item.title}</a>
	</h3>
	{#if item.locality || item.authority}
		<p class="mt-1 text-sm text-liibra-muted">
			{#if item.authority}{item.authority}{/if}
			{#if item.authority && item.locality} · {/if}
			{#if item.locality}{item.locality}{/if}
		</p>
	{/if}
	{#if item.summary}
		<p class="mt-2 text-sm text-liibra-muted">{item.summary}</p>
	{/if}
	<p class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-liibra-muted">
		<span class="font-mono break-all">{m.result_urn}: {item.urn}</span>
		{#if item.sourceUrl}
			<a href={item.sourceUrl} rel="external nofollow noopener" target="_blank">{m.result_source}</a>
		{/if}
	</p>
</article>
