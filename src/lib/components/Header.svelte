<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Messages } from '$lib/i18n';
	import type { Locale } from '$lib/i18n/locales';
	import SearchBox from './SearchBox.svelte';
	import LangToggle from './LangToggle.svelte';
	import liibraMark from '$lib/assets/liibra-mark.svg';

	let {
		m,
		locale,
		redirectTo,
		query = ''
	}: { m: Messages; locale: Locale; redirectTo: string; query?: string } = $props();
</script>

<header class="border-b border-liibra-rule bg-white">
	<div class="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
		<a href={resolve('/')} class="flex items-center gap-2 font-serif text-2xl font-bold tracking-tight text-liibra-ink no-underline hover:no-underline">
			<img src={liibraMark} alt="" class="h-8 w-auto" />
			{m.brand}
		</a>
		<nav aria-label={m.nav_proposicoes} class="order-1 text-sm sm:order-2">
			<a href={resolve('/proposicoes')}>{m.nav_proposicoes}</a>
		</nav>
		<div class="order-3 w-full sm:order-2 sm:w-auto sm:flex-1">
			<SearchBox {m} value={query} />
		</div>
		<div class="order-2 sm:order-3">
			<LangToggle {m} {locale} {redirectTo} />
		</div>
	</div>
</header>
