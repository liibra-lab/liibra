// The data-access seam for legislative propositions. Routes depend on
// `PropositionSource`, never on the concrete Câmara client, mirroring the
// `LegalSource` pattern in `$lib/server/legal`. All methods are async because
// the only implementation today is a network source.

import type { Author, PropositionDetail, PropositionSummary } from './types';
import type { FetchLike } from './client';

export interface PropositionFilters {
	/** Free-text keywords (`keywords` param on the API). */
	keywords?: string;
	/** Restrict to a proposition type, e.g. "PL", "PEC". */
	siglaTipo?: string;
	/** Restrict to a year of presentation. */
	ano?: number;
	/** 1-based page number. */
	page?: number;
}

export interface PropositionSource {
	list(filters: PropositionFilters, fetchImpl: FetchLike): Promise<PropositionSummary[]>;
	getById(id: number, fetchImpl: FetchLike): Promise<PropositionDetail | null>;
	getAuthors(id: number, fetchImpl: FetchLike): Promise<Author[]>;
}
