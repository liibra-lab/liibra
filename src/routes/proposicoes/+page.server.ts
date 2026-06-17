import type { PageServerLoad } from './$types';
import { propositionSource, CamaraApiError, type PropositionSummary } from '$lib/server/camara';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const keywords = (url.searchParams.get('q') ?? '').trim();
	const siglaTipo = (url.searchParams.get('tipo') ?? '').trim();
	const anoRaw = (url.searchParams.get('ano') ?? '').trim();
	const ano = /^\d{4}$/.test(anoRaw) ? Number(anoRaw) : undefined;
	const pageRaw = Number(url.searchParams.get('pagina') ?? '1');
	const page = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1;

	const filters = {
		keywords: keywords || undefined,
		siglaTipo: siglaTipo || undefined,
		ano,
		page
	};

	let propositions: PropositionSummary[] = [];
	let failed = false;
	try {
		propositions = await propositionSource.list(filters, fetch);
	} catch (err) {
		if (!(err instanceof CamaraApiError)) throw err;
		failed = true;
	}

	return {
		propositions,
		failed,
		filters: { keywords, siglaTipo, ano: anoRaw, page }
	};
};
