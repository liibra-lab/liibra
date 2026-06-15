// In-memory LegalSource backed by the seeded dataset. A future LexmlSruSource
// will implement the same interface and be swapped in via ./index.ts.

import type { LegalDocument } from './types';
import type { LegalSource, SearchHit, SearchOptions } from './source';
import { searchDocuments } from './search';

export class SeedLegalSource implements LegalSource {
	#documents: LegalDocument[];
	#byUrn: Map<string, LegalDocument>;

	constructor(documents: LegalDocument[]) {
		this.#documents = documents;
		this.#byUrn = new Map(documents.map((doc) => [doc.urn, doc]));
	}

	async search(query: string, opts?: SearchOptions): Promise<SearchHit[]> {
		return searchDocuments(this.#documents, query, opts?.limit);
	}

	async getByUrn(urn: string): Promise<LegalDocument | null> {
		return this.#byUrn.get(urn) ?? null;
	}

	async list(): Promise<LegalDocument[]> {
		return this.#documents;
	}
}
