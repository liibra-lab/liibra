<script lang="ts">
	import type { Messages } from '$lib/i18n';
	import type { Locale } from '$lib/i18n/locales';
	import { documentTypeLabel, formatDate } from '$lib/i18n';
	import type { LegalDocument } from '$lib/server/legal/types';

	let { doc, m, locale }: { doc: LegalDocument; m: Messages; locale: Locale } = $props();
</script>

<dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
	<dt class="text-liibra-muted">{m.meta_type}</dt>
	<dd>{documentTypeLabel(locale, doc.type)}</dd>

	<dt class="text-liibra-muted">{m.meta_number}</dt>
	<dd>{doc.number}</dd>

	<dt class="text-liibra-muted">{m.meta_date}</dt>
	<dd>{formatDate(locale, doc.date)}</dd>

	<dt class="text-liibra-muted">{m.meta_source}</dt>
	<dd>
		<!-- external link to the canonical source record -->
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a href={doc.source.url} target="_blank" rel="noopener noreferrer">
			{doc.source.name}
		</a>
		{#if doc.source.note}
			<p class="mt-1 text-xs text-liibra-muted">
				{doc.source.note}{#if doc.source.capturedAt} ({m.meta_captured_at} {formatDate(locale, doc.source.capturedAt)}){/if}
			</p>
		{/if}
	</dd>
</dl>
