<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Messages } from '$lib/i18n';
	import type { Locale } from '$lib/i18n/locales';
	import { documentCategoryLabel } from '$lib/i18n';
	import {
		DOCUMENT_CATEGORIES,
		type LegalSearchParams
	} from '$lib/legal/search-types';

	let { m, locale, params }: { m: Messages; locale: Locale; params: LegalSearchParams } = $props();

	// "Clear" keeps the free-text query but drops every filter.
	let clearHref = $derived(
		params.q ? `${resolve('/search')}?q=${encodeURIComponent(params.q)}` : resolve('/search')
	);
</script>

<form method="GET" action={resolve('/search')} class="text-sm">
	<!-- Preserve the active query and sort when applying filters. -->
	<input type="hidden" name="q" value={params.q ?? ''} />
	<input type="hidden" name="sort" value={params.sort ?? 'relevance'} />

	<h2 class="font-serif text-lg">{m.filters_title}</h2>

	<div class="mt-4">
		<label class="block font-medium" for="filter-category">{m.filter_category}</label>
		<select
			id="filter-category"
			name="category"
			class="mt-1 w-full rounded-md border border-liibra-rule bg-white px-2 py-1.5"
		>
			<option value="">{m.filter_all_categories}</option>
			{#each DOCUMENT_CATEGORIES as category (category)}
				<option value={category} selected={params.category === category}>
					{documentCategoryLabel(locale, category)}
				</option>
			{/each}
		</select>
	</div>

	<div class="mt-4">
		<label class="block font-medium" for="filter-locality">{m.filter_locality}</label>
		<input
			id="filter-locality"
			name="locality"
			value={params.locality ?? ''}
			placeholder="Brasil"
			class="mt-1 w-full rounded-md border border-liibra-rule bg-white px-2 py-1.5"
		/>
	</div>

	<div class="mt-4">
		<label class="block font-medium" for="filter-authority">{m.filter_authority}</label>
		<input
			id="filter-authority"
			name="authority"
			value={params.authority ?? ''}
			placeholder="Federal"
			class="mt-1 w-full rounded-md border border-liibra-rule bg-white px-2 py-1.5"
		/>
	</div>

	<div class="mt-4 flex gap-2">
		<div class="flex-1">
			<label class="block font-medium" for="filter-date-from">{m.filter_date_from}</label>
			<input
				id="filter-date-from"
				name="dateFrom"
				inputmode="numeric"
				maxlength="4"
				value={params.dateFrom ?? ''}
				placeholder="2000"
				class="mt-1 w-full rounded-md border border-liibra-rule bg-white px-2 py-1.5"
			/>
		</div>
		<div class="flex-1">
			<label class="block font-medium" for="filter-date-to">{m.filter_date_to}</label>
			<input
				id="filter-date-to"
				name="dateTo"
				inputmode="numeric"
				maxlength="4"
				value={params.dateTo ?? ''}
				placeholder="2020"
				class="mt-1 w-full rounded-md border border-liibra-rule bg-white px-2 py-1.5"
			/>
		</div>
	</div>

	<div class="mt-5 flex items-center gap-3">
		<button
			type="submit"
			class="rounded-md bg-liibra-ink px-4 py-1.5 font-medium text-white hover:opacity-90"
		>
			{m.filter_apply}
		</button>
		<!-- clearHref is a resolve()'d path with a query string -->
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a href={clearHref}>{m.filter_clear}</a>
	</div>
</form>
