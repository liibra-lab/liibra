// Seeded dataset of real Brazilian federal legislation.
//
// NOTE: article texts are FAITHFUL but PARTIAL excerpts — only a handful of
// articles per law are included for this first slice. URNs and source links are
// the genuine LexML identifiers. When the live LexML SRU source is wired in,
// this module is no longer the source of truth (see ./index.ts).

import type { LegalDocument } from './types';

const lexmlUrl = (urn: string) => `https://www.lexml.gov.br/urn/${urn}`;

const constituicaoUrn = 'urn:lex:br:federal:constituicao:1988-10-05;1988';
const codigoCivilUrn = 'urn:lex:br:federal:lei:2002-01-10;10406';
const cdcUrn = 'urn:lex:br:federal:lei:1990-09-11;8078';

export const seedDocuments: LegalDocument[] = [
	{
		urn: constituicaoUrn,
		type: 'constituicao',
		jurisdiction: 'br:federal',
		coverage: 'partial',
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
		articles: [
			{
				number: '1',
				label: 'Dos Princípios Fundamentais',
				text: 'A República Federativa do Brasil, formada pela união indissolúvel dos Estados e Municípios e do Distrito Federal, constitui-se em Estado Democrático de Direito e tem como fundamentos:\nI - a soberania;\nII - a cidadania;\nIII - a dignidade da pessoa humana;\nIV - os valores sociais do trabalho e da livre iniciativa;\nV - o pluralismo político.\nParágrafo único. Todo o poder emana do povo, que o exerce por meio de representantes eleitos ou diretamente, nos termos desta Constituição.'
			},
			{
				number: '3',
				text: 'Constituem objetivos fundamentais da República Federativa do Brasil:\nI - construir uma sociedade livre, justa e solidária;\nII - garantir o desenvolvimento nacional;\nIII - erradicar a pobreza e a marginalização e reduzir as desigualdades sociais e regionais;\nIV - promover o bem de todos, sem preconceitos de origem, raça, sexo, cor, idade e quaisquer outras formas de discriminação.'
			},
			{
				number: '5',
				label: 'Dos Direitos e Deveres Individuais e Coletivos',
				text: 'Todos são iguais perante a lei, sem distinção de qualquer natureza, garantindo-se aos brasileiros e aos estrangeiros residentes no País a inviolabilidade do direito à vida, à liberdade, à igualdade, à segurança e à propriedade, nos termos seguintes:\nI - homens e mulheres são iguais em direitos e obrigações, nos termos desta Constituição;\nII - ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei;\nIII - ninguém será submetido a tortura nem a tratamento desumano ou degradante.'
			}
		],
		source: { name: 'LexML', url: lexmlUrl(constituicaoUrn) }
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
