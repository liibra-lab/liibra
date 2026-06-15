import type { Locale } from './locales';

// UI chrome and metadata labels only. Legal source text is never translated —
// it stays in Portuguese because it is Brazilian law. Both locale objects must
// satisfy `Messages`, so a missing key is a compile-time error.
export interface Messages {
	brand: string;
	tagline: string;
	nav_home: string;
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
}

const pt: Messages = {
	brand: 'Liibra',
	tagline: 'Informação jurídica brasileira, aberta e acessível',
	nav_home: 'Início',
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
	type_codigo: 'Código'
};

const en: Messages = {
	brand: 'Liibra',
	tagline: 'Brazilian legal information, open and accessible',
	nav_home: 'Home',
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
	type_codigo: 'Code'
};

export const messages: Record<Locale, Messages> = { pt, en };
