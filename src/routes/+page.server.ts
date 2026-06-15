import type { PageServerLoad } from './$types';
import { legalSource } from '$lib/server/legal';

export const load: PageServerLoad = async () => {
	const documents = await legalSource.list();
	return {
		documents: documents.map((doc) => ({
			urn: doc.urn,
			type: doc.type,
			number: doc.number,
			title: doc.title,
			shortTitle: doc.shortTitle,
			summary: doc.summary
		}))
	};
};
