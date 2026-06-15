// Composition root for the legal data layer. Routes import the `legalSource`
// singleton from `$lib/server/legal` and never reference a concrete class — so
// swapping the seed for a live LexML SRU client is a one-line change here:
//
//   export const legalSource: LegalSource = new LexmlSruSource(env.LEXML_SRU_URL);

import type { LegalSource } from './source';
import { SeedLegalSource } from './seed-source';
import { seedDocuments } from './seed-data';

export const legalSource: LegalSource = new SeedLegalSource(seedDocuments);

export type { LegalDocument, Article, DocumentType } from './types';
export type { SearchHit, SearchOptions, MatchedArticle, LegalSource } from './source';
