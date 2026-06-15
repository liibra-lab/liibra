<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { t } from '$lib/i18n';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children, data } = $props();

	let m = $derived(t(data.locale));
	let redirectTo = $derived(page.url.pathname + page.url.search);
	let query = $derived(page.url.pathname === '/search' ? (page.url.searchParams.get('q') ?? '') : '');
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<a
	href="#main"
	class="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:shadow"
>
	{m.skip_to_content}
</a>

<div class="flex min-h-screen flex-col">
	<Header {m} locale={data.locale} {redirectTo} {query} />
	<main id="main" class="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
		{@render children()}
	</main>
	<Footer {m} />
</div>
