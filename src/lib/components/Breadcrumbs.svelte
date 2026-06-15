<script lang="ts">
	export interface Crumb {
		label: string;
		href?: string;
	}

	let { items, label = 'breadcrumb' }: { items: Crumb[]; label?: string } = $props();
</script>

<nav aria-label={label} class="text-sm text-liibra-muted">
	<ol class="flex flex-wrap items-center gap-1">
		{#each items as item, i (i)}
			<li class="flex items-center gap-1">
				{#if item.href && i < items.length - 1}
					<!-- hrefs are pre-resolved with resolve() by callers -->
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a href={item.href}>{item.label}</a>
				{:else}
					<span aria-current="page" class="text-liibra-ink">{item.label}</span>
				{/if}
				{#if i < items.length - 1}
					<span aria-hidden="true">/</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
