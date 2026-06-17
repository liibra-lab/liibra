// Domain types for the Câmara dos Deputados "Dados Abertos" v2 API. Fields are
// mapped 1:1 from the API payloads — we never invent or infer data, so that
// everything shown can be traced back to the official source.

/**
 * The API's `siglaTipo` (e.g. "PL", "PEC", "PLP", "MPV", "PDL"). Kept as a
 * free-form string because the API publishes dozens of types; we display it
 * verbatim rather than enumerating an inevitably-incomplete union.
 */
export type PropositionType = string;

/** List item, as returned by `GET /proposicoes`. */
export interface PropositionSummary {
	id: number;
	siglaTipo: PropositionType;
	numero: number;
	ano: number;
	ementa: string;
}

/** Tramitação status, from `dados.statusProposicao` on the detail endpoint. */
export interface PropositionStatus {
	dataHora: string;
	descricaoSituacao: string | null;
	descricaoTramitacao: string | null;
	siglaOrgao: string | null;
	despacho: string | null;
}

/** Full record, as returned by `GET /proposicoes/{id}`. */
export interface PropositionDetail extends PropositionSummary {
	ementaDetalhada?: string;
	keywords?: string;
	dataApresentacao?: string;
	urlInteiroTeor?: string;
	statusProposicao?: PropositionStatus;
}

/** Author entry, from `GET /proposicoes/{id}/autores`. */
export interface Author {
	nome: string;
	tipo: string;
	uri?: string;
}

/**
 * Where this data came from. Powers the source-attribution block so every
 * proposition is independently verifiable.
 */
export interface Provenance {
	/** Official ficha de tramitação page on camara.leg.br. */
	officialUrl: string;
	/** Raw API URL that produced this record. */
	apiUrl: string;
	/** Inteiro teor (full text) document, when the API provides one. */
	fullTextUrl?: string;
	/** ISO timestamp of the last tramitação update, when available. */
	lastUpdated?: string;
}
