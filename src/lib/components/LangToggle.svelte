<script lang="ts">
	import type { Messages } from '$lib/i18n';
	import type { Locale } from '$lib/i18n/locales';

	let { m, locale, redirectTo }: { m: Messages; locale: Locale; redirectTo: string } = $props();

	// The locale to switch TO is the one that isn't active.
	let target: Locale = $derived(locale === 'pt' ? 'en' : 'pt');
	let targetLabel = $derived(target === 'pt' ? m.lang_pt : m.lang_en);
</script>

<form action="/lang" method="POST" class="shrink-0">
	<input type="hidden" name="locale" value={target} />
	<input type="hidden" name="redirectTo" value={redirectTo} />
	<button
		type="submit"
		class="rounded-md border border-liibra-rule px-2.5 py-1.5 text-sm text-liibra-ink hover:bg-liibra-surface"
		aria-label="{m.lang_label}: {targetLabel}"
	>
		{targetLabel}
	</button>
</form>
