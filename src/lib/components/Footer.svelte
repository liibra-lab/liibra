<script lang="ts">
	import type { Messages } from '$lib/i18n';

	let { m }: { m: Messages } = $props();
</script>

<footer class="mt-16 border-t border-liibra-rule bg-liibra-surface">
	<div class="mx-auto max-w-5xl px-4 py-8 text-sm text-liibra-muted">
		<p class="font-serif text-base text-liibra-ink">{m.brand}</p>
		<p class="mt-1">{m.tagline}</p>
		<p class="mt-3">{m.footer_attribution}</p>
	</div>
</footer>
