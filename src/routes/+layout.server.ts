import type { LayoutServerLoad } from './$types';

// Expose the request-scoped locale to every route via `$page.data.locale`.
export const load: LayoutServerLoad = ({ locals }) => {
	return { locale: locals.locale };
};
