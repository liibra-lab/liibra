<script lang="ts">
	import type { Messages } from '$lib/i18n';
	import type { Article } from '$lib/server/legal/types';

	let { articles, m }: { articles: Article[]; m: Messages } = $props();
</script>

<nav aria-label={m.toc_title} class="hidden lg:block">
	<div class="sticky top-8">
		<p class="font-serif text-sm font-bold uppercase tracking-wide text-liibra-muted">
			{m.toc_title}
		</p>
		<ul class="mt-3 space-y-1 border-l border-liibra-rule">
			{#each articles as article (article.number)}
				<li>
					<a href="#art-{article.number}" class="block py-0.5 pl-3 text-sm">
						{m.article_abbr} {article.number}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</nav>
