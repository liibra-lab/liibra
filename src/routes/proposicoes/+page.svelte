<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	import { t } from '$lib/i18n';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import PropositionCard from '$lib/components/PropositionCard.svelte';

	let { data }: { data: PageData } = $props();

	let m = $derived(t(data.locale));

	// Common proposition types; the value maps to the API's `siglaTipo`.
	const types = ['PL', 'PEC', 'PLP', 'MPV', 'PDL', 'PRC'];

	let page = $derived(data.filters.page);

	// Page numbers to render: first, last, and a window around the current page,
	// with 'gap' marking each elided range.
	function pageItems(current: number, total: number): (number | 'gap')[] {
		const wanted = [1, current - 1, current, current + 1, total];
		const pages = [...new Set(wanted.filter((p) => p >= 1 && p <= total))].sort((a, b) => a - b);
		const items: (number | 'gap')[] = [];
		for (const [i, p] of pages.entries()) {
			if (i > 0 && p - pages[i - 1] > 1) items.push('gap');
			items.push(p);
		}
		return items;
	}

	function pageHref(target: number): string {
		const parts = [`pagina=${target}`];
		if (data.filters.keywords) parts.push(`q=${encodeURIComponent(data.filters.keywords)}`);
		if (data.filters.siglaTipo) parts.push(`tipo=${encodeURIComponent(data.filters.siglaTipo)}`);
		if (data.filters.ano) parts.push(`ano=${encodeURIComponent(data.filters.ano)}`);
		return `${resolve('/proposicoes')}?${parts.join('&')}`;
	}
</script>

<svelte:head>
	<title>{m.prop_browse_title} · {m.brand}</title>
	<meta name="description" content={m.prop_browse_subtitle} />
</svelte:head>

<Breadcrumbs
	items={[{ label: m.nav_home, href: resolve('/') }, { label: m.prop_browse_title }]}
/>

<h1 class="mt-4 text-3xl">{m.prop_browse_title}</h1>
<p class="mt-2 max-w-2xl text-liibra-muted">{m.prop_browse_subtitle}</p>

<form
	action={resolve('/proposicoes')}
	method="GET"
	class="mt-6 flex flex-wrap items-end gap-3 border-b border-liibra-rule pb-6"
>
	<div class="min-w-0 flex-1">
		<label class="block text-sm text-liibra-muted" for="q">{m.search_label}</label>
		<input
			id="q"
			name="q"
			type="search"
			value={data.filters.keywords}
			placeholder={m.prop_search_placeholder}
			autocomplete="off"
			class="mt-1 w-full rounded-md border border-liibra-rule bg-white px-3 py-1.5 text-sm
				text-liibra-ink placeholder:text-liibra-muted focus:border-liibra-ink focus:outline-none"
		/>
	</div>
	<div>
		<label class="block text-sm text-liibra-muted" for="tipo">{m.prop_filter_type}</label>
		<select
			id="tipo"
			name="tipo"
			class="mt-1 rounded-md border border-liibra-rule bg-white px-3 py-1.5 text-sm
				focus:border-liibra-ink focus:outline-none"
		>
			<option value="" selected={data.filters.siglaTipo === ''}>{m.prop_filter_all_types}</option>
			{#each types as type (type)}
				<option value={type} selected={data.filters.siglaTipo === type}>{type}</option>
			{/each}
		</select>
	</div>
	<div>
		<label class="block text-sm text-liibra-muted" for="ano">{m.prop_filter_year}</label>
		<input
			id="ano"
			name="ano"
			type="number"
			inputmode="numeric"
			min="1988"
			max="2100"
			value={data.filters.ano}
			class="mt-1 w-24 rounded-md border border-liibra-rule bg-white px-3 py-1.5 text-sm
				focus:border-liibra-ink focus:outline-none"
		/>
	</div>
	<button
		type="submit"
		class="rounded-md bg-liibra-ink px-4 py-1.5 text-sm font-medium text-white hover:opacity-90"
	>
		{m.prop_filter_apply}
	</button>
</form>

{#if data.failed}
	<p class="mt-6 rounded-md border border-liibra-rule bg-liibra-surface p-4 text-liibra-muted">
		{m.prop_source_unavailable}
	</p>
{:else if data.propositions.length === 0}
	<p class="mt-6 text-liibra-muted">{m.prop_no_results}</p>
{:else}
	<div class="mt-2">
		{#each data.propositions as proposition (proposition.id)}
			<PropositionCard {proposition} />
		{/each}
	</div>

	{#if page > 1 || data.hasNext}
		<!-- pageHref() builds a resolve()'d path with a query string -->
		<!-- eslint-disable svelte/no-navigation-without-resolve -->
		<nav
			class="mt-6 flex flex-wrap items-center justify-center gap-1.5 text-sm"
			aria-label={m.pagination_label}
		>
			{#if page > 1}
				<a href={pageHref(page - 1)} class="rounded-md px-2 py-1">← {m.prev_page}</a>
			{/if}
			{#if data.totalPages}
				{#each pageItems(page, data.totalPages) as item, i (item === 'gap' ? `gap-${i}` : item)}
					{#if item === 'gap'}
						<span class="px-1 text-liibra-muted" aria-hidden="true">…</span>
					{:else if item === page}
						<span
							aria-current="page"
							class="rounded-md border border-liibra-rule bg-liibra-surface px-2.5 py-1 font-medium"
						>
							{item}
						</span>
					{:else}
						<a href={pageHref(item)} aria-label={`${m.page_label} ${item}`} class="rounded-md px-2.5 py-1">
							{item}
						</a>
					{/if}
				{/each}
			{/if}
			{#if data.hasNext}
				<a href={pageHref(page + 1)} class="rounded-md px-2 py-1">{m.next_page} →</a>
			{/if}
		</nav>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
	{/if}
{/if}
