// Composition root for the Câmara legislative-data layer. Routes import the
// `propositionSource` singleton and never reference the concrete class, mirroring
// `$lib/server/legal`. Swapping in a different backend is a one-line change here.

import type { PropositionSource } from './source';
import { CamaraPropositionSource } from './camara-source';

export const propositionSource: PropositionSource = new CamaraPropositionSource();

export { buildProvenance, officialUrl, apiUrl, PAGE_SIZE } from './camara-source';
export { CamaraApiError } from './client';
export type {
	PropositionSummary,
	PropositionDetail,
	PropositionStatus,
	Author,
	Provenance
} from './types';
export type { PropositionSource, PropositionFilters } from './source';
