<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	import { t, resultsCount, searchWarningLabel } from '$lib/i18n';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import SearchBox from '$lib/components/SearchBox.svelte';
	import SearchFilters from '$lib/components/SearchFilters.svelte';
	import SearchResultCard from '$lib/components/SearchResultCard.svelte';
	import type { SearchSort } from '$lib/legal/search-types';
	import { searchQueryString } from '$lib/legal/search-url';

	let { data }: { data: PageData } = $props();

	let m = $derived(t(data.locale));
	let params = $derived(data.params);
	let result = $derived(data.result);

	let warningCodes = $derived(result.warnings ?? []);
	let requireQuery = $derived(warningCodes.includes('require_query'));
	let hasError = $derived(
		warningCodes.includes('source_unavailable') || warningCodes.includes('malformed_response')
	);
	// Deduped, user-safe warning messages (require_query is handled separately).
	let notices = $derived([
		...new Set(
			warningCodes
				.map((code) => searchWarningLabel(data.locale, code))
				.filter((label): label is string => label !== null)
		)
	]);

	let totalPages = $derived(
		result.pageSize > 0 ? Math.ceil(result.total / result.pageSize) : 0
	);

	type Overrides = { page?: number; sort?: SearchSort };

	/** Build a /search URL from the active params plus overrides, omitting defaults. */
	function searchUrl(overrides: Overrides = {}): string {
		const qs = searchQueryString(params, overrides);
		return qs ? `${resolve('/search')}?${qs}` : resolve('/search');
	}

	let sortOptions = $derived<{ value: SearchSort; label: string }[]>([
		{ value: 'relevance', label: m.sort_relevance },
		{ value: 'title', label: m.sort_title },
		{ value: 'date_asc', label: m.sort_date_asc },
		{ value: 'date_desc', label: m.sort_date_desc }
	]);
</script>

<svelte:head>
	<title>{params.q ? `${params.q} — ` : ''}{m.results_title} · {m.brand}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<Breadcrumbs
	label="breadcrumb"
	items={[{ label: m.nav_home, href: resolve('/') }, { label: m.results_title }]}
/>

<h1 class="mt-4 text-3xl">{m.results_title}</h1>

<div class="mt-4 max-w-2xl">
	<SearchBox {m} value={params.q ?? ''} />
</div>

{#if requireQuery}
	<p class="mt-6 text-liibra-muted">{m.no_query}</p>
{:else}
	{#if notices.length > 0}
		<div class="mt-4 rounded-md border border-liibra-rule bg-liibra-surface px-4 py-3 text-sm">
			{#each notices as notice (notice)}
				<p class="text-liibra-muted">{notice}</p>
			{/each}
		</div>
	{/if}

	<div class="mt-6 grid gap-8 lg:grid-cols-[16rem_1fr]">
		<aside>
			<SearchFilters {m} locale={data.locale} {params} />
		</aside>

		<section>
			{#if result.items.length === 0}
				{#if !hasError}
					<p class="text-liibra-muted">{m.no_results}</p>
				{/if}
			{:else}
				<div class="flex flex-wrap items-center justify-between gap-3 border-b border-liibra-rule pb-3">
					<p class="text-sm text-liibra-muted">{resultsCount(data.locale, result.total)}</p>
					<form method="GET" action={resolve('/search')} class="flex items-center gap-2 text-sm">
						<input type="hidden" name="q" value={params.q ?? ''} />
						{#if params.category}<input type="hidden" name="category" value={params.category} />{/if}
						{#if params.locality}<input type="hidden" name="locality" value={params.locality} />{/if}
						{#if params.authority}<input type="hidden" name="authority" value={params.authority} />{/if}
						{#if params.dateFrom}<input type="hidden" name="dateFrom" value={params.dateFrom} />{/if}
						{#if params.dateTo}<input type="hidden" name="dateTo" value={params.dateTo} />{/if}
						<label for="sort">{m.sort_label}</label>
						<select
							id="sort"
							name="sort"
							class="rounded-md border border-liibra-rule bg-white px-2 py-1"
							onchange={(e) => e.currentTarget.form?.requestSubmit()}
						>
							{#each sortOptions as option (option.value)}
								<option value={option.value} selected={(params.sort ?? 'relevance') === option.value}>
									{option.label}
								</option>
							{/each}
						</select>
						<button type="submit" class="rounded-md border border-liibra-rule px-2 py-1">
							{m.filter_apply}
						</button>
					</form>
				</div>

				<div>
					{#each result.items as item (item.urn)}
						<SearchResultCard {item} {m} locale={data.locale} />
					{/each}
				</div>

				<nav class="mt-6 flex items-center justify-between text-sm" aria-label="pagination">
					{#if result.page > 1}
						<!-- searchUrl() builds a resolve()'d path with a query string -->
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
						<a href={searchUrl({ page: result.page - 1 })}>← {m.prev_page}</a>
					{:else}
						<span></span>
					{/if}
					<span class="text-liibra-muted">
						{m.page_label} {result.page}{#if totalPages > 0} / {totalPages}{/if}
					</span>
					{#if totalPages === 0 || result.page < totalPages}
						<!-- searchUrl() builds a resolve()'d path with a query string -->
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
						<a href={searchUrl({ page: result.page + 1 })}>{m.next_page} →</a>
					{:else}
						<span></span>
					{/if}
				</nav>

				<p class="mt-6 text-xs text-liibra-muted">{m.search_source_note}</p>
			{/if}
		</section>
	</div>
{/if}
