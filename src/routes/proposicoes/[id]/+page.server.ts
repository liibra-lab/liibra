import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { propositionSource, buildProvenance, CamaraApiError } from '$lib/server/camara';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const id = Number(params.id);
	if (!Number.isInteger(id) || id <= 0) error(404, 'Bill not found');

	let detail;
	let authors;
	try {
		[detail, authors] = await Promise.all([
			propositionSource.getById(id, fetch),
			propositionSource.getAuthors(id, fetch)
		]);
	} catch (err) {
		if (err instanceof CamaraApiError) error(502, 'Câmara API unavailable');
		throw err;
	}

	if (!detail) error(404, 'Bill not found');

	return {
		proposition: detail,
		authors,
		provenance: buildProvenance(detail)
	};
};
