import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { legalSource } from '$lib/server/legal';

export const load: PageServerLoad = async ({ params }) => {
	const urn = decodeURIComponent(params.urn);
	const document = await legalSource.getByUrn(urn);
	if (!document) error(404, 'Document not found');
	return { document };
};
