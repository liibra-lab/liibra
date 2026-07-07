# Legal data tool layer principles

This file owns the standing rules and key design for Liibra's legal data tool
layer: the LexML-based URN, metadata, resolver, vocabulary, ingestion, and source
adapter layer under `src/lib/server/legal/`.

It does **not** own product-level principles, architecture invariants, language
rules, or global non-goals. Those remain in [`docs/PRINCIPLES.md`](docs/PRINCIPLES.md).
It does **not** own the plan of record or phase acceptance criteria. Those remain
in [`ROADMAP.md`](ROADMAP.md).

Read this file with the same convention used by `ROADMAP.md`: the principles in
this document are binding for this layer; named mechanisms such as module paths,
type shapes, pipelines, and storage splits are the best guess at the time of
writing. Decide implementation details when implementing, preferring the
simplest design that satisfies this file, `docs/PRINCIPLES.md`, and `ROADMAP.md`.

## Principles

1. **LexML is the identity and metadata backbone.** LexML provides the durable
   identifier, metadata, XML, controlled-vocabulary, and resolver model for this
   layer. Câmara, Senado, dados.gov.br, and future official sources are
   source-specific enrichers behind adapters. No single upstream API is treated
   as "the" Liibra API.

2. **Adapters at the boundary, normalized objects inside.** External sources
   implement the `LegalSource` seam that already exists in
   `src/lib/server/legal/source.ts`. Internal code consumes Liibra-normalized
   objects, not upstream response shapes. Source-specific enrichers follow the
   pattern already used under `src/lib/server/camara/`.

3. **The URN is the central primitive.** The core chain is:

   ```text
   URN -> metadata -> occurrence URL -> version -> fragment -> relationship
   ```

   Canonical URNs are normalized before storage or comparison. Normalization
   lowercases, removes diacritics and `ç`, parses structure rather than treating
   the URN as an opaque string, supports partial dates where LexML permits them,
   and rejects non-`urn:lex:br` input. Canonical URNs and reference URNs are
   distinct concepts.

4. **FRBR layering, never a flat `Document`.** Work, expression/version,
   fragment, and relationship are separate entities. "Lei 8.112", "the
   consolidated text on date X", and "art. 5 of version Y" are not the same
   object.

5. **Resolution is not search.** Search takes words, fields, and filters.
   Resolution takes a URN and returns occurrences with an explicit match level:
   exact, parent, or fuzzy. Fallback is visible; it is never silent.

6. **Fragment IDs are first-class.** LexML fragment identifiers such as `art5`,
   `art5_par1`, and `art20_cpt_inc2` are modeled as data, not as incidental text
   anchors.

7. **Vocabularies are data, not code.** Authority, locality, document-type,
   event, language, and content-nature normalization live in growable vocabulary
   storage. Mappings such as `stf` -> `supremo.tribunal.federal` are data
   records, not hard-coded tables embedded in parsers.

8. **Metadata search is presented honestly.** Until full text is indexed,
   Liibra search in this layer is metadata search. This is the legal-data-layer
   application of the honest-presentation rule owned by `docs/PRINCIPLES.md`.

9. **The edge-first invariant applies to this layer.** Ingestion, harvesting,
   refresh, and persistence use Workers-compatible primitives such as Cron
   Triggers, D1, KV, and R2. The LexML OAI provider kit's relational workflow is
   a reference model, not a mandate for a long-running server.

10. **XML support is staged.** Metadata parsing and URN/fragment parsing come
    first. Full-text LexML XML schema validation, rendering, and fragment
    extraction belong to the full-text work in `ROADMAP.md`; full LexML XML
    authoring is not part of the initial layer.

## Key design

The mechanisms below are provisional. They record the intended shape of the
layer and the load-bearing decisions, but implementation may choose simpler
names or splits while preserving the principles above.

### Target module map

```text
src/lib/server/legal/
  sources/
    camara-source.ts
    senado-source.ts
    lexml-sru-source.ts
    lexml-oai-source.ts
  urn/
    parser.ts
    builder.ts
    normalizer.ts
    validator.ts
  metadata/
    oai-parser.ts
    oai-validator.ts
    relationship-mapper.ts
  xml/
    lexml-schema-validator.ts
    fragment-extractor.ts
    text-normalizer.ts
  resolver/
    urn-resolver.ts
    occurrence-ranker.ts
  search/
    query-parser.ts
    metadata-index.ts
    filters.ts
  vocab/
    vocabulary-store.ts
    authority-normalizer.ts
    locality-normalizer.ts
    document-type-normalizer.ts
```

Existing files already occupy several of these roles:
`src/lib/server/legal/source.ts`, `lexml-sru-source.ts`, `cql.ts`,
`sru-parse.ts`, `search.ts`, `seed-source.ts`, `seed-data.ts`, `index.ts`, and
`types.ts`. Migration into subfolders should happen opportunistically when code
changes require it, not as a big-bang rename.

### Internal data model

```ts
type LegalWork = {
	id: string;
	urn: string;
	category: LegalCategory;
	authority: string;
	locality: string;
	documentType: string;
	number?: string;
	date?: string;
	title?: string;
	aliases: string[];
};

type LegalExpression = {
	id: string;
	workId: string;
	urn: string;
	versionDate?: string;
	language: string;
	form: string;
	sourceUrl?: string;
	mimeType?: string;
};

type LegalFragment = {
	id: string;
	expressionId: string;
	urn: string;
	fragmentId: string;
	label?: string;
	text?: string;
};

type LegalRelationship = {
	sourceUrn: string;
	targetUrn: string;
	type:
		| 'altera'
		| 'correlato.a'
		| 'declara.inconstitucional'
		| 'declara.inconstitucional.dispositivo'
		| 'emenda.de'
		| 'equivalente.a'
		| 'membro.de'
		| 'parecer.de'
		| 'parte.de'
		| 'peticao.inicial.de'
		| 'publicacao.oficial'
		| 'referencia'
		| 'regulamenta'
		| 'revoga'
		| 'revoga.dispositivo'
		| 'sucessivo.ou.precedente.de'
		| 'sucessor.logico.de';
};
```

### URN function surface

```ts
parseLexmlUrn(raw: string): ParsedLexmlUrn;
normalizeLexmlUrn(parsed: ParsedLexmlUrn, vocab: VocabularyStore): NormalizedLexmlUrn;
buildCanonicalUrn(input: CanonicalUrnInput): string;
isCanonicalUrn(urn: string): boolean;
toReferenceUrn(input: ReferenceUrnInput): string;
```

Canonical example:

```text
urn:lex:br:federal:lei:1990-09-11;8078
```

| Rule | Code implication |
| --- | --- |
| Namespace starts with `urn:lex:br:` | Reject non-LexML Brasil identifiers at the parser boundary. |
| Canonical comparison is lowercase | Normalize before storage, comparison, and cache keys. |
| Diacritics and `ç` are removed | Use Unicode normalization plus explicit cedilla handling. |
| Dates use `YYYY-MM-DD`; partial dates may appear in references | Model exact and partial dates, and keep partial-date matching explicit. |
| `:` separates major elements | Parse structurally; do not rely on a naive string split as the full parser. |
| `@` identifies version | Map to expression/version data. |
| `!` identifies fragment | Map to `LegalFragment`. |
| `~` identifies form/language | Map to representation metadata. |
| `;` adds specificity | Preserve nested authority, document-type, and descriptor structure. |

### Resolver semantics

| Input level | Expected result |
| --- | --- |
| Document complex | All known individual versions and occurrences. |
| Document individual | All occurrences of that exact version. |
| Fragment | The requested fragment, or a visible fallback to the parent document level. |
| Incomplete or imprecise URN | Normalized fuzzy result using URN components. |

```ts
async function resolveUrn(urn: string): Promise<ResolutionResult> {
	const parsed = parseLexmlUrn(urn);
	const normalized = await normalizeLexmlUrn(parsed, vocab);

	const exact = await catalog.findExact(normalized);
	if (exact.length > 0) return { match: 'exact', occurrences: exact };

	const parent = await catalog.findParentLevel(normalized);
	if (parent.length > 0) return { match: 'parent', occurrences: parent };

	const fuzzy = await searchByUrnParts(normalized);
	return { match: 'fuzzy', occurrences: fuzzy };
}
```

### Search contract

```ts
type LegalSearchInput = {
	terms?: string;
	exclude?: string;
	category?: LegalCategory;
	documentType?: string;
	locality?: string;
	authority?: string;
	number?: string;
	title?: string;
	alias?: string;
	ementa?: string;
	indexation?: string;
	urn?: string;
	yearFrom?: number;
	yearTo?: number;
	page?: number;
	pageSize?: number;
	sort?: 'relevance' | 'date' | 'authority' | 'documentType';
};
```

Search normalization pipeline:

```text
raw query
  -> lowercase
  -> normalize accents and cedilla
  -> normalize punctuation
  -> normalize leading zeros in numbers
  -> normalize ordinals
  -> normalize hyphenated terms
  -> expand known vocabulary variants
  -> tokenize
  -> apply operators
```

### Tool surface

```ts
export const legalTools = {
	searchLegalDocuments,
	resolveLegalUrn,
	getLegalDocumentByUrn,
	getLegalRelationships,
	normalizeLegalUrn,
	validateLexmlMetadata,
	importLexmlOaiRecord
};

type ToolResult<T> = {
	ok: boolean;
	data?: T;
	error?: {
		code: string;
		message: string;
		details?: unknown;
	};
	source?: {
		provider: 'lexml' | 'camara' | 'senado' | 'dadosgov' | 'local';
		fetchedAt: string;
	};
};
```

### OAI ingestion pipeline

OAI-PMH ingestion is Phase-2 material unless `ROADMAP.md` is changed.

```ts
type OaiSourceRecord = {
	identifier: string;
	datestamp: string;
	deleted: boolean;
	rawXml: string;
	parsedMetadata: LexmlOaiMetadata;
};
```

```text
fetch source record
  -> validate XML shape
  -> parse DocumentoIndividual URN
  -> normalize URN
  -> upsert LegalWork
  -> upsert LegalExpression
  -> upsert occurrence Item URL
  -> upsert aliases, ementa, indexation, catalog fields
  -> upsert relationships
  -> advance source cursor / datestamp
```

The LexML provider kit's `registro_item` table and validation flags are useful
reference material for compatibility, but Liibra's runtime implementation must
remain compatible with the Workers runtime invariant owned by `docs/PRINCIPLES.md`.

### Priority mapping onto `ROADMAP.md`

| This overview stage | `ROADMAP.md` owner |
| --- | --- |
| URN parser/normalizer, query parser, SRU source, resolver, and local schema | Phase 1 — unify search and document resolution. |
| OAI harvesting, metadata upserts, relationship mapping, and source cursors | Phase 2/3 persistence and ingestion work, as scheduled by `ROADMAP.md`. |
| Full-text XML validation, rendering, and fragment extraction | Phase 2 — full text via LexML XML. |

## Non-goals for this layer

- No clone of the `lexml.gov.br` portal UI.
- No full LexML XML authoring in the initial implementation.
- No flat single-`Document` model for legal data.
- No hard-coded vocabulary tables embedded in parsers or resolvers.

Global non-goals remain owned by `docs/PRINCIPLES.md`.
