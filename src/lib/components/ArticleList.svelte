<script lang="ts">
	import type { Messages } from '$lib/i18n';
	import type { Article } from '$lib/server/legal/types';

	let { articles, m }: { articles: Article[]; m: Messages } = $props();
</script>

<div class="space-y-8">
	{#each articles as article (article.number)}
		<section id="art-{article.number}" class="scroll-mt-24">
			<h2 class="text-xl">
				{m.article_abbr} {article.number}
				{#if article.label}
					<span class="block text-base font-normal text-liibra-muted">{article.label}</span>
				{/if}
			</h2>
			<p class="mt-2 whitespace-pre-line leading-relaxed text-liibra-ink">{article.text}</p>
		</section>
	{/each}
</div>
