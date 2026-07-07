<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import type { PageData } from './$types';
	import { t } from '$lib/i18n';
	import {
		API_CATALOG_PATH,
		API_DOCS_PATH,
		OPENAPI_PATH
	} from '$lib/discovery/api-catalog';

	let { data }: { data: PageData } = $props();

	let m = $derived(t(data.locale));

	const EXAMPLE_URN = 'urn:lex:br:federal:constituicao:1988-10-05;1988';
</script>

<svelte:head>
	<title>{m.docs_api_title} — {m.brand}</title>
	<meta name="description" content={m.docs_api_intro} />
</svelte:head>

<article class="mx-auto max-w-3xl">
	<h1 class="text-3xl font-bold tracking-tight">{m.docs_api_title}</h1>
	<p class="mt-3 text-liibra-muted">{m.docs_api_intro}</p>

	<section class="mt-8 border-t border-liibra-rule pt-6">
		<h2 class="text-2xl">{m.docs_api_urn_title}</h2>
		<p class="mt-2">{m.docs_api_urn_body}</p>
		<p class="mt-3 text-sm text-liibra-muted">{m.docs_api_urn_example}:</p>
		<pre
			class="mt-1 overflow-x-auto rounded-md border border-liibra-rule p-3 text-sm"><code
				>GET /urn/{EXAMPLE_URN}
→ 308 Location: /doc/{EXAMPLE_URN}</code></pre>
		<p class="mt-2 text-sm">
			<a href={resolve('/doc/[...urn]', { urn: EXAMPLE_URN })}>/doc/{EXAMPLE_URN}</a>
		</p>
	</section>

	<section class="mt-8 border-t border-liibra-rule pt-6">
		<h2 class="text-2xl">{m.docs_api_discovery_title}</h2>
		<p class="mt-2">{m.docs_api_discovery_body}</p>
		<ul class="mt-3 list-disc space-y-1 pl-6">
			<li>
				<a href={resolve('/.well-known/api-catalog')}><code>{API_CATALOG_PATH}</code></a> —
				{m.docs_api_link_catalog}
			</li>
			<li>
				<a href={asset('/docs/api/openapi.json')}><code>{OPENAPI_PATH}</code></a> —
				{m.docs_api_link_openapi}
			</li>
			<li>
				<a href={asset('/sitemap.xml')}><code>/sitemap.xml</code></a> — {m.docs_api_link_sitemap}
			</li>
		</ul>
		<pre
			class="mt-3 overflow-x-auto rounded-md border border-liibra-rule p-3 text-sm"><code
				>Link: &lt;{API_CATALOG_PATH}&gt;; rel="api-catalog", &lt;{API_DOCS_PATH}&gt;; rel="service-doc", &lt;{OPENAPI_PATH}&gt;; rel="service-desc"</code></pre>
	</section>

	<section class="mt-8 border-t border-liibra-rule pt-6">
		<p class="text-sm text-liibra-muted">{m.docs_api_attribution}</p>
	</section>
</article>
