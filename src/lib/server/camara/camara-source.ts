// Live implementation of `PropositionSource` backed by the Câmara "Dados
// Abertos" v2 API. Responsibilities: pass filters through to the API, map raw
// JSON onto our domain types, and build the source-attribution URLs.

import {
	API_BASE,
	camaraFetch,
	camaraFetchEnvelope,
	CamaraApiError,
	type CamaraLink,
	type FetchLike
} from './client';
import type { PropositionSource, PropositionFilters } from './source';
import type {
	Author,
	PropositionDetail,
	PropositionPage,
	PropositionStatus,
	PropositionSummary,
	Provenance
} from './types';

export const PAGE_SIZE = 20;

/** Canonical public page for a proposition on camara.leg.br. */
export function officialUrl(id: number): string {
	return `https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=${id}`;
}

/** Raw API URL for a proposition — lets anyone re-fetch and verify the data. */
export function apiUrl(id: number): string {
	return `${API_BASE}/proposicoes/${id}`;
}

/** Build the full provenance record shown by the source-attribution block. */
export function buildProvenance(detail: PropositionDetail): Provenance {
	return {
		officialUrl: officialUrl(detail.id),
		apiUrl: apiUrl(detail.id),
		fullTextUrl: detail.urlInteiroTeor || undefined,
		lastUpdated: detail.statusProposicao?.dataHora || undefined
	};
}

// --- Raw API shapes (only the fields we consume) ---------------------------

interface RawSummary {
	id: number;
	siglaTipo: string;
	numero: number;
	ano: number;
	ementa: string;
}

interface RawStatus {
	dataHora?: string;
	descricaoSituacao?: string | null;
	descricaoTramitacao?: string | null;
	siglaOrgao?: string | null;
	despacho?: string | null;
}

interface RawDetail extends RawSummary {
	ementaDetalhada?: string;
	keywords?: string;
	dataApresentacao?: string;
	urlInteiroTeor?: string;
	statusProposicao?: RawStatus;
}

interface RawAuthor {
	nome: string;
	tipo?: string;
	uri?: string;
}

function mapSummary(raw: RawSummary): PropositionSummary {
	return {
		id: raw.id,
		siglaTipo: raw.siglaTipo,
		numero: raw.numero,
		ano: raw.ano,
		ementa: raw.ementa ?? ''
	};
}

/** Total page count, read from the `pagina` param of the `last` pagination link. */
function lastPageFrom(links: CamaraLink[]): number | undefined {
	const last = links.find((link) => link.rel === 'last');
	if (!last) return undefined;
	try {
		const page = Number(new URL(last.href).searchParams.get('pagina'));
		return Number.isInteger(page) && page > 0 ? page : undefined;
	} catch {
		return undefined;
	}
}

function mapStatus(raw: RawStatus): PropositionStatus {
	return {
		dataHora: raw.dataHora ?? '',
		descricaoSituacao: raw.descricaoSituacao ?? null,
		descricaoTramitacao: raw.descricaoTramitacao ?? null,
		siglaOrgao: raw.siglaOrgao ?? null,
		despacho: raw.despacho ?? null
	};
}

export class CamaraPropositionSource implements PropositionSource {
	async list(filters: PropositionFilters, fetchImpl: FetchLike): Promise<PropositionPage> {
		const { dados, links } = await camaraFetchEnvelope<RawSummary[]>(
			'/proposicoes',
			{
				keywords: filters.keywords,
				siglaTipo: filters.siglaTipo,
				ano: filters.ano,
				pagina: filters.page && filters.page > 0 ? filters.page : 1,
				itens: PAGE_SIZE,
				ordem: 'DESC',
				ordenarPor: 'id'
			},
			fetchImpl
		);
		return {
			items: dados.map(mapSummary),
			hasNext: links.some((link) => link.rel === 'next'),
			totalPages: lastPageFrom(links)
		};
	}

	async getById(id: number, fetchImpl: FetchLike): Promise<PropositionDetail | null> {
		let raw: RawDetail;
		try {
			raw = await camaraFetch<RawDetail>(`/proposicoes/${id}`, undefined, fetchImpl);
		} catch (err) {
			if (err instanceof CamaraApiError && err.status === 404) return null;
			throw err;
		}
		return {
			...mapSummary(raw),
			ementaDetalhada: raw.ementaDetalhada || undefined,
			keywords: raw.keywords || undefined,
			dataApresentacao: raw.dataApresentacao || undefined,
			urlInteiroTeor: raw.urlInteiroTeor || undefined,
			statusProposicao: raw.statusProposicao ? mapStatus(raw.statusProposicao) : undefined
		};
	}

	async getAuthors(id: number, fetchImpl: FetchLike): Promise<Author[]> {
		let dados: RawAuthor[];
		try {
			dados = await camaraFetch<RawAuthor[]>(`/proposicoes/${id}/autores`, undefined, fetchImpl);
		} catch (err) {
			if (err instanceof CamaraApiError && err.status === 404) return [];
			throw err;
		}
		return dados.map((raw) => ({
			nome: raw.nome,
			tipo: raw.tipo ?? '',
			uri: raw.uri || undefined
		}));
	}
}
