<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Messages } from '$lib/i18n';
	import type { Locale } from '$lib/i18n/locales';
	import { documentTypeLabel } from '$lib/i18n';
	import type { SearchHit } from '$lib/server/legal/source';

	let { hit, m, locale }: { hit: SearchHit; m: Messages; locale: Locale } = $props();

	let doc = $derived(hit.document);
	let title = $derived(locale === 'en' && doc.title.en ? doc.title.en : doc.title.pt);
	let href = $derived(resolve('/doc/[...urn]', { urn: doc.urn }));
</script>

<article class="border-b border-liibra-rule py-4">
	<p class="text-xs uppercase tracking-wide text-liibra-muted">
		{documentTypeLabel(locale, doc.type)} · {doc.number}
	</p>
	<h3 class="mt-1 text-lg">
		<a {href} class="font-serif">{title}</a>
	</h3>
	{#each hit.matchedArticles as match (match.number)}
		<p class="mt-2 text-sm text-liibra-muted">
			<span class="font-medium text-liibra-ink">{m.article_abbr} {match.number}</span>
			— {match.snippet}
		</p>
	{/each}
</article>
