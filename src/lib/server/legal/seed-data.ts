// Seeded dataset of real Brazilian federal legislation.
//
// The Constituição Federal carries its FULL permanent text (arts. 1–250,
// including amendment-inserted articles like 156-A and revoked ones like 117),
// from ../../data/constituicao-federal.json. That file is generated from the
// official Planalto "texto compilado" by scripts/fetch-constituicao-planalto.ts
// (see `source` below for provenance and capture date).
//
// The other documents' article texts remain FAITHFUL but PARTIAL excerpts.
// When the live LexML SRU source is wired in, this module is no longer the
// source of truth (see ./index.ts).

import type { Article, LegalDocument } from './types';
import constituicaoFederalArticles from '$lib/data/constituicao-federal.json';

const lexmlUrl = (urn: string) => `https://www.lexml.gov.br/urn/${urn}`;

const constituicaoUrn = 'urn:lex:br:federal:constituicao:1988-10-05;1988';
const codigoCivilUrn = 'urn:lex:br:federal:lei:2002-01-10;10406';
const cdcUrn = 'urn:lex:br:federal:lei:1990-09-11;8078';

export const seedDocuments: LegalDocument[] = [
	{
		urn: constituicaoUrn,
		type: 'constituicao',
		jurisdiction: 'br:federal',
		coverage: 'full',
		date: '1988-10-05',
		number: '1988',
		title: {
			pt: 'Constituição da República Federativa do Brasil de 1988',
			en: 'Constitution of the Federative Republic of Brazil (1988)'
		},
		shortTitle: { pt: 'Constituição Federal', en: 'Federal Constitution' },
		summary: {
			pt: 'A lei fundamental e suprema do Brasil, que organiza o Estado e garante os direitos fundamentais.',
			en: 'The supreme and fundamental law of Brazil, organizing the State and guaranteeing fundamental rights.'
		},
		articles: constituicaoFederalArticles as Article[],
		source: {
			name: 'Planalto — Constituição da República Federativa do Brasil de 1988, texto compilado',
			url: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm',
			capturedAt: '2026-06-18',
			note: 'Texto compilado oficial (reflete emendas até a EC nº 139/2026). Conferir na fonte antes de uso jurídico.'
		}
	},
	{
		urn: codigoCivilUrn,
		type: 'codigo',
		jurisdiction: 'br:federal',
		coverage: 'partial',
		date: '2002-01-10',
		number: '10.406',
		title: {
			pt: 'Lei nº 10.406, de 10 de janeiro de 2002 — Institui o Código Civil',
			en: 'Law No. 10,406 of January 10, 2002 — Brazilian Civil Code'
		},
		shortTitle: { pt: 'Código Civil', en: 'Civil Code' },
		summary: {
			pt: 'Regula os direitos e obrigações de ordem privada das pessoas, bens e suas relações.',
			en: "Governs private-law rights and obligations of persons, property and their relations."
		},
		articles: [
			{
				number: '1',
				label: 'Da Personalidade e da Capacidade',
				text: 'Toda pessoa é capaz de direitos e deveres na ordem civil.'
			},
			{
				number: '2',
				text: 'A personalidade civil da pessoa começa do nascimento com vida; mas a lei põe a salvo, desde a concepção, os direitos do nascituro.'
			},
			{
				number: '11',
				label: 'Dos Direitos da Personalidade',
				text: 'Com exceção dos casos previstos em lei, os direitos da personalidade são intransmissíveis e irrenunciáveis, não podendo o seu exercício sofrer limitação voluntária.'
			},
			{
				number: '421',
				label: 'Da Função Social do Contrato',
				text: 'A liberdade contratual será exercida nos limites da função social do contrato.\nParágrafo único. Nas relações contratuais privadas, prevalecerão o princípio da intervenção mínima e a excepcionalidade da revisão contratual.'
			}
		],
		source: { name: 'LexML', url: lexmlUrl(codigoCivilUrn) }
	},
	{
		urn: cdcUrn,
		type: 'lei',
		jurisdiction: 'br:federal',
		coverage: 'partial',
		date: '1990-09-11',
		number: '8.078',
		title: {
			pt: 'Lei nº 8.078, de 11 de setembro de 1990 — Código de Defesa do Consumidor',
			en: 'Law No. 8,078 of September 11, 1990 — Consumer Protection Code'
		},
		shortTitle: { pt: 'Código de Defesa do Consumidor', en: 'Consumer Protection Code' },
		summary: {
			pt: 'Estabelece normas de proteção e defesa do consumidor, de ordem pública e interesse social.',
			en: 'Establishes consumer protection rules of public order and social interest.'
		},
		articles: [
			{
				number: '1',
				text: 'O presente código estabelece normas de proteção e defesa do consumidor, de ordem pública e interesse social, nos termos dos arts. 5°, inciso XXXII, 170, inciso V, da Constituição Federal e art. 48 de suas Disposições Transitórias.'
			},
			{
				number: '2',
				text: 'Consumidor é toda pessoa física ou jurídica que adquire ou utiliza produto ou serviço como destinatário final.\nParágrafo único. Equipara-se a consumidor a coletividade de pessoas, ainda que indetermináveis, que haja intervindo nas relações de consumo.'
			},
			{
				number: '6',
				label: 'Dos Direitos Básicos do Consumidor',
				text: 'São direitos básicos do consumidor:\nI - a proteção da vida, saúde e segurança contra os riscos provocados por práticas no fornecimento de produtos e serviços considerados perigosos ou nocivos;\nII - a educação e divulgação sobre o consumo adequado dos produtos e serviços, asseguradas a liberdade de escolha e a igualdade nas contratações;\nIII - a informação adequada e clara sobre os diferentes produtos e serviços, com especificação correta de quantidade, características, composição, qualidade, tributos incidentes e preço, bem como sobre os riscos que apresentem.'
			}
		],
		source: { name: 'LexML', url: lexmlUrl(cdcUrn) }
	}
];
