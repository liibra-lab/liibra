<script lang="ts">
	import type { Messages } from '$lib/i18n';
	import type { Locale } from '$lib/i18n/locales';
	import { formatDateTime } from '$lib/i18n';
	import type { PropositionDetail } from '$lib/server/camara';

	let {
		proposition,
		m,
		locale
	}: { proposition: PropositionDetail; m: Messages; locale: Locale } = $props();

	let status = $derived(proposition.statusProposicao);
</script>

<dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
	<dt class="text-liibra-muted">{m.prop_filter_type}</dt>
	<dd>{proposition.siglaTipo}</dd>

	{#if proposition.dataApresentacao}
		<dt class="text-liibra-muted">{m.prop_presented_on}</dt>
		<dd>{formatDateTime(locale, proposition.dataApresentacao)}</dd>
	{/if}

	{#if status?.descricaoSituacao}
		<dt class="text-liibra-muted">{m.prop_status}</dt>
		<dd>{status.descricaoSituacao}</dd>
	{/if}

	{#if status?.siglaOrgao}
		<dt class="text-liibra-muted">{m.prop_status_organ}</dt>
		<dd>{status.siglaOrgao}</dd>
	{/if}
</dl>
