<script lang="ts">
	import type { Messages } from '$lib/i18n';

	let { m, value = '', variant = 'compact' }: { m: Messages; value?: string; variant?: 'compact' | 'hero' } =
		$props();
</script>

<form action="/search" method="GET" role="search" class="flex w-full gap-2">
	<label class="sr-only" for="q">{m.search_label}</label>
	<input
		id="q"
		name="q"
		type="search"
		{value}
		placeholder={m.search_placeholder}
		autocomplete="off"
		class="min-w-0 flex-1 rounded-md border border-liibra-rule bg-white px-3 text-liibra-ink
			placeholder:text-liibra-muted focus:border-liibra-ink focus:outline-none
			{variant === 'hero' ? 'py-3 text-lg' : 'py-1.5 text-sm'}"
	/>
	<button
		type="submit"
		class="shrink-0 rounded-md bg-liibra-ink px-4 font-medium text-white hover:opacity-90
			{variant === 'hero' ? 'py-3 text-base' : 'py-1.5 text-sm'}"
	>
		{m.search_submit}
	</button>
</form>
