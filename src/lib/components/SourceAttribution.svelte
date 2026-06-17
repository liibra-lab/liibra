<script lang="ts">
	import type { Messages } from '$lib/i18n';
	import type { Locale } from '$lib/i18n/locales';
	import { formatDateTime } from '$lib/i18n';
	import type { Provenance } from '$lib/server/camara';

	let {
		provenance,
		m,
		locale
	}: { provenance: Provenance; m: Messages; locale: Locale } = $props();
</script>

<!-- Source attribution: every field on this page can be traced back to the
     official record via these links. -->
<section
	aria-label={m.prop_provenance_title}
	class="rounded-md border border-liibra-rule bg-liibra-surface p-4 text-sm"
>
	<h2 class="text-base font-semibold">{m.prop_provenance_title}</h2>
	<ul class="mt-2 space-y-1">
		<li>
			<!-- external links to the canonical Câmara records -->
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href={provenance.officialUrl} target="_blank" rel="noopener noreferrer">
				{m.prop_official_page}
			</a>
		</li>
		{#if provenance.fullTextUrl}
			<li>
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a href={provenance.fullTextUrl} target="_blank" rel="noopener noreferrer">
					{m.prop_full_text}
				</a>
			</li>
		{/if}
		<li>
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href={provenance.apiUrl} target="_blank" rel="noopener noreferrer">
				{m.prop_verify_api}
			</a>
		</li>
	</ul>

	{#if provenance.lastUpdated}
		<p class="mt-3 text-liibra-muted">
			{m.prop_last_updated}: {formatDateTime(locale, provenance.lastUpdated)}
		</p>
	{/if}
	<p class="mt-1 text-xs text-liibra-muted">{m.prop_data_source}</p>
</section>
