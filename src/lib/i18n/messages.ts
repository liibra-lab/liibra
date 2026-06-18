import type { Locale } from './locales';

// UI chrome and metadata labels only. Legal source text is never translated —
// it stays in Portuguese because it is Brazilian law. Both locale objects must
// satisfy `Messages`, so a missing key is a compile-time error.
export interface Messages {
	brand: string;
	tagline: string;
	nav_home: string;
	nav_proposicoes: string;
	search_label: string;
	search_placeholder: string;
	search_submit: string;
	hero_title: string;
	hero_subtitle: string;
	browse_title: string;
	results_title: string;
	results_count_one: string;
	results_count_other: string;
	no_results: string;
	no_query: string;
	toc_title: string;
	article_abbr: string;
	meta_type: string;
	meta_number: string;
	meta_date: string;
	meta_source: string;
	source_view_on_lexml: string;
	lang_label: string;
	lang_pt: string;
	lang_en: string;
	skip_to_content: string;
	footer_attribution: string;
	not_found_title: string;
	not_found_body: string;
	type_constituicao: string;
	type_lei: string;
	type_decreto: string;
	type_codigo: string;
	prop_browse_title: string;
	prop_browse_subtitle: string;
	prop_search_placeholder: string;
	prop_filter_type: string;
	prop_filter_year: string;
	prop_filter_apply: string;
	prop_filter_all_types: string;
	prop_no_results: string;
	prop_source_unavailable: string;
	prop_ementa: string;
	prop_ementa_detalhada: string;
	prop_authors: string;
	prop_status: string;
	prop_status_organ: string;
	prop_presented_on: string;
	prop_keywords: string;
	prop_provenance_title: string;
	prop_official_page: string;
	prop_full_text: string;
	prop_verify_api: string;
	prop_last_updated: string;
	prop_data_source: string;
	prop_not_found_title: string;
	prop_not_found_body: string;
	prev_page: string;
	next_page: string;
	page_label: string;
	// Search filters / facet rail
	filters_title: string;
	filter_category: string;
	filter_locality: string;
	filter_authority: string;
	filter_date_from: string;
	filter_date_to: string;
	filter_all_categories: string;
	filter_apply: string;
	filter_clear: string;
	sort_label: string;
	sort_relevance: string;
	sort_title: string;
	sort_date_asc: string;
	sort_date_desc: string;
	// LexML document categories
	cat_legislacao: string;
	cat_jurisprudencia: string;
	cat_doutrina: string;
	cat_proposicoes: string;
	cat_outras_manifestacoes: string;
	cat_publicacao_oficial: string;
	cat_processo: string;
	// Result card + warnings
	result_urn: string;
	result_source: string;
	search_source_note: string;
	warning_source_unavailable: string;
	warning_malformed: string;
	warning_sort_page_only: string;
	warning_invalid_date: string;
	warning_sru_diagnostic: string;
}

const pt: Messages = {
	brand: 'Liibra',
	tagline: 'Informação jurídica brasileira, aberta e acessível',
	nav_home: 'Início',
	nav_proposicoes: 'Proposições',
	search_label: 'Buscar na legislação',
	search_placeholder: 'Busque por lei, código ou termo…',
	search_submit: 'Buscar',
	hero_title: 'Pesquise a legislação brasileira',
	hero_subtitle: 'Acesso claro e aberto a leis e códigos federais, com fonte no LexML.',
	browse_title: 'Navegue pela legislação',
	results_title: 'Resultados',
	results_count_one: 'resultado',
	results_count_other: 'resultados',
	no_results: 'Nenhum resultado encontrado para sua busca.',
	no_query: 'Digite um termo para buscar na legislação.',
	toc_title: 'Artigos',
	article_abbr: 'Art.',
	meta_type: 'Tipo',
	meta_number: 'Número',
	meta_date: 'Data',
	meta_source: 'Fonte',
	source_view_on_lexml: 'Ver no LexML',
	lang_label: 'Idioma',
	lang_pt: 'Português',
	lang_en: 'English',
	skip_to_content: 'Pular para o conteúdo',
	footer_attribution:
		'Conteúdo jurídico proveniente do LexML Brasil. Liibra é um projeto independente.',
	not_found_title: 'Documento não encontrado',
	not_found_body: 'Não foi possível localizar o documento solicitado.',
	type_constituicao: 'Constituição',
	type_lei: 'Lei',
	type_decreto: 'Decreto',
	type_codigo: 'Código',
	prop_browse_title: 'Proposições legislativas',
	prop_browse_subtitle:
		'Projetos de lei e demais proposições, direto da API de Dados Abertos da Câmara dos Deputados.',
	prop_search_placeholder: 'Busque por palavra-chave…',
	prop_filter_type: 'Tipo',
	prop_filter_year: 'Ano',
	prop_filter_apply: 'Filtrar',
	prop_filter_all_types: 'Todos os tipos',
	prop_no_results: 'Nenhuma proposição encontrada para estes filtros.',
	prop_source_unavailable:
		'Não foi possível contatar a API da Câmara dos Deputados. Tente novamente em instantes.',
	prop_ementa: 'Ementa',
	prop_ementa_detalhada: 'Ementa detalhada',
	prop_authors: 'Autoria',
	prop_status: 'Situação',
	prop_status_organ: 'Órgão',
	prop_presented_on: 'Apresentada em',
	prop_keywords: 'Palavras-chave',
	prop_provenance_title: 'Fonte e verificação',
	prop_official_page: 'Ficha de tramitação oficial',
	prop_full_text: 'Inteiro teor (texto completo)',
	prop_verify_api: 'Dados brutos na API',
	prop_last_updated: 'Última atualização',
	prop_data_source: 'Dados: Dados Abertos da Câmara dos Deputados',
	prop_not_found_title: 'Proposição não encontrada',
	prop_not_found_body: 'Não foi possível localizar a proposição solicitada.',
	prev_page: 'Anterior',
	next_page: 'Próxima',
	page_label: 'Página',
	filters_title: 'Filtros',
	filter_category: 'Categoria do documento',
	filter_locality: 'Localidade',
	filter_authority: 'Autoridade',
	filter_date_from: 'De (ano)',
	filter_date_to: 'Até (ano)',
	filter_all_categories: 'Todas as categorias',
	filter_apply: 'Aplicar',
	filter_clear: 'Limpar',
	sort_label: 'Ordenar por',
	sort_relevance: 'Relevância',
	sort_title: 'Título',
	sort_date_asc: 'Data ascendente',
	sort_date_desc: 'Data descendente',
	cat_legislacao: 'Legislação',
	cat_jurisprudencia: 'Jurisprudência',
	cat_doutrina: 'Doutrina',
	cat_proposicoes: 'Proposições Legislativas',
	cat_outras_manifestacoes: 'Outras Manifestações',
	cat_publicacao_oficial: 'Publicação Oficial',
	cat_processo: 'Processo',
	result_urn: 'URN',
	result_source: 'Ver no LexML',
	search_source_note: 'Resultados da busca no LexML Brasil (SRU).',
	warning_source_unavailable:
		'Não foi possível contatar o LexML agora. Tente novamente em instantes.',
	warning_malformed: 'A resposta do LexML não pôde ser interpretada.',
	warning_sort_page_only: 'Ordenação aplicada apenas a esta página de resultados.',
	warning_invalid_date: 'Filtro de data ignorado: use um ano com quatro dígitos (AAAA).',
	warning_sru_diagnostic: 'O LexML retornou um aviso para esta consulta.'
};

const en: Messages = {
	brand: 'Liibra',
	tagline: 'Brazilian legal information, open and accessible',
	nav_home: 'Home',
	nav_proposicoes: 'Bills',
	search_label: 'Search the legislation',
	search_placeholder: 'Search for a law, code or term…',
	search_submit: 'Search',
	hero_title: 'Search Brazilian legislation',
	hero_subtitle: 'Clear, open access to federal laws and codes, sourced from LexML.',
	browse_title: 'Browse the legislation',
	results_title: 'Results',
	results_count_one: 'result',
	results_count_other: 'results',
	no_results: 'No results found for your search.',
	no_query: 'Enter a term to search the legislation.',
	toc_title: 'Articles',
	article_abbr: 'Art.',
	meta_type: 'Type',
	meta_number: 'Number',
	meta_date: 'Date',
	meta_source: 'Source',
	source_view_on_lexml: 'View on LexML',
	lang_label: 'Language',
	lang_pt: 'Português',
	lang_en: 'English',
	skip_to_content: 'Skip to content',
	footer_attribution:
		'Legal content sourced from LexML Brasil. Liibra is an independent project.',
	not_found_title: 'Document not found',
	not_found_body: 'The requested document could not be located.',
	type_constituicao: 'Constitution',
	type_lei: 'Law',
	type_decreto: 'Decree',
	type_codigo: 'Code',
	prop_browse_title: 'Legislative bills',
	prop_browse_subtitle:
		'Bills and other propositions, straight from the Chamber of Deputies Open Data API.',
	prop_search_placeholder: 'Search by keyword…',
	prop_filter_type: 'Type',
	prop_filter_year: 'Year',
	prop_filter_apply: 'Filter',
	prop_filter_all_types: 'All types',
	prop_no_results: 'No bills found for these filters.',
	prop_source_unavailable:
		'Could not reach the Chamber of Deputies API. Please try again shortly.',
	prop_ementa: 'Summary',
	prop_ementa_detalhada: 'Detailed summary',
	prop_authors: 'Authorship',
	prop_status: 'Status',
	prop_status_organ: 'Body',
	prop_presented_on: 'Presented on',
	prop_keywords: 'Keywords',
	prop_provenance_title: 'Source & verification',
	prop_official_page: 'Official tracking page',
	prop_full_text: 'Full text (inteiro teor)',
	prop_verify_api: 'Raw data on the API',
	prop_last_updated: 'Last updated',
	prop_data_source: 'Data: Open Data, Brazilian Chamber of Deputies',
	prop_not_found_title: 'Bill not found',
	prop_not_found_body: 'The requested bill could not be located.',
	prev_page: 'Previous',
	next_page: 'Next',
	page_label: 'Page',
	filters_title: 'Filters',
	filter_category: 'Document category',
	filter_locality: 'Locality',
	filter_authority: 'Authority',
	filter_date_from: 'From (year)',
	filter_date_to: 'To (year)',
	filter_all_categories: 'All categories',
	filter_apply: 'Apply',
	filter_clear: 'Clear',
	sort_label: 'Sort by',
	sort_relevance: 'Relevance',
	sort_title: 'Title',
	sort_date_asc: 'Date ascending',
	sort_date_desc: 'Date descending',
	cat_legislacao: 'Legislation',
	cat_jurisprudencia: 'Case law',
	cat_doutrina: 'Doctrine',
	cat_proposicoes: 'Legislative bills',
	cat_outras_manifestacoes: 'Other instruments',
	cat_publicacao_oficial: 'Official publications',
	cat_processo: 'Proceedings',
	result_urn: 'URN',
	result_source: 'View on LexML',
	search_source_note: 'Search results from LexML Brasil (SRU).',
	warning_source_unavailable:
		'Could not reach LexML right now. Please try again shortly.',
	warning_malformed: 'The LexML response could not be read.',
	warning_sort_page_only: 'Ordering applied to this page of results only.',
	warning_invalid_date: 'Date filter ignored: use a four-digit year (YYYY).',
	warning_sru_diagnostic: 'LexML returned a notice for this query.'
};

export const messages: Record<Locale, Messages> = { pt, en };
