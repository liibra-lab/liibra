// Regenerates src/lib/data/constituicao-federal.json from the official Planalto
// "texto compilado" of the 1988 Constitution.
//
//   node --experimental-strip-types scripts/fetch-constituicao-planalto.ts
//
// IMPORTANT: this must run from a network that can reach planalto.gov.br. Some
// sandboxes (including Claude Code's default web environment) block that host via
// an egress allowlist; in that case download the page manually and pass a local
// file path as the first argument:
//
//   node --experimental-strip-types scripts/fetch-constituicao-planalto.ts ./constituicao.html
//
// The page is the COMPILED text: superseded wordings are wrapped in <strike> and
// must be dropped; only revoked-article headers (followed by "(Revogado…)") are
// kept. After running, update `capturedAt` in src/lib/server/legal/seed-data.ts
// and re-check the article count and the latest Emenda Constitucional reflected.
//
// This script is the repository's ONE sanctioned exception to the ROADMAP
// non-goal "no scraping where an official API or XML source exists": the
// compiled constitutional text has no official XML endpoint, the script runs
// offline at development time (never in the Worker), and its output is a
// curated seed with full source attribution. Do not treat it as precedent for
// scraping other sources.

import { readFile, writeFile } from 'node:fs/promises';

const SOURCE_URL =
	'https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm';
const OUT_PATH = new URL('../src/lib/data/constituicao-federal.json', import.meta.url);

interface Article {
	number: string;
	label?: string;
	text: string;
}

/** Planalto serves windows-1252; decode bytes accordingly. */
async function loadHtml(localPath?: string): Promise<string> {
	const bytes = localPath
		? await readFile(localPath)
		: new Uint8Array(await (await fetch(SOURCE_URL)).arrayBuffer());
	return new TextDecoder('windows-1252').decode(bytes);
}

const NAMED: Record<string, string> = {
	nbsp: ' ', ordm: 'º', ordf: 'ª', deg: '°', sect: '§', middot: '·', bull: '•',
	amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", hellip: '…', ndash: '–', mdash: '—'
};

const SMALL = new Set([
	'de','da','do','das','dos','e','a','o','as','os','à','às','em','no','na','nos','nas','para','com','sem','sob','entre','ou'
]);
const fixCase = (s: string): string =>
	s !== s.toUpperCase()
		? s
		: s
				.toLowerCase()
				.split(/\s+/)
				.map((w, i) => (i > 0 && SMALL.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
				.join(' ');

export function parseConstituicao(html: string): Article[] {
	const startIdx = html.search(/<a\s+name="art1"\s*>/i);
	const adctIdx = html.search(/<a\s+name="art1adct"/i);
	let body = html.slice(startIdx >= 0 ? startIdx : 0, adctIdx > 0 ? adctIdx : html.length);

	body = body
		.replace(/<!--[\s\S]*?-->/g, ' ')
		.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
		// Keep a revoked article's header (struck, followed by "(Revogado…)").
		.replace(/<strike>\s*(Art\.\s*\d+(?:-[A-Z])?)\b[^<]*<\/strike>(?=[\s\S]{0,250}?\(Revogado)/gi, '$1. ')
		// Drop every other struck (superseded) wording.
		.replace(/<strike>[\s\S]*?<\/strike>/gi, ' ')
		.replace(/<(s|del)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
		.replace(/<sup>\s*([oa])s?\s*<\/sup>/gi, (_m, x: string) => (x.toLowerCase() === 'o' ? 'º' : 'ª'))
		.replace(/[\r\n\t]+/g, ' ')
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<\/(p|div|tr|li|h[1-6]|table)>/gi, '\n')
		.replace(/<p[^>]*>/gi, '\n')
		.replace(/<[^>]+>/g, '');

	body = body
		.replace(/&#x([0-9a-f]+);/gi, (_m, h: string) => String.fromCodePoint(parseInt(h, 16)))
		.replace(/&#(\d+);/g, (_m, d: string) => String.fromCodePoint(parseInt(d, 10)))
		.replace(/&([a-zA-Z]+);/g, (m: string, n: string) => (n in NAMED ? NAMED[n] : m))
		.replace(/\u00a0/g, ' ');

	const lines = body
		.split('\n')
		.map((l) => l.replace(/\s+/g, ' ').trim())
		.filter(Boolean);

	const HEAD_RE = /^(t[íi]tulo|cap[íi]tulo|subse[çc][ãa]o|se[çc][ãa]o)\b/i;
	const ART_RE = /^Art\.\s*(\d+(?:-[A-Z])?)\s*[º°ª.]*\s*(.*)$/;
	const CLOSE_RE = /^Bras[íi]lia,\s*5 de outubro de 1988/i;
	const NOTE_RE = /\(|Emenda Constitucional|Vide|Regulamento|http|Lei nº/i;
	const commaFix = (s: string) => s.replace(/,(?=[A-Za-zÀ-ÿ])/g, ', ');

	const articles: Article[] = [];
	let cur: { number: string; parts: string[]; label?: string } | null = null;
	let collectingLabel = false;
	let labelParts: string[] = [];

	const flush = () => {
		if (!cur) return;
		const text = commaFix(
			cur.parts.map((s) => s.trim()).filter(Boolean).join('\n').replace(/^\.\s*/, '')
		).trim();
		articles.push(cur.label ? { number: cur.number, label: cur.label, text } : { number: cur.number, text });
		cur = null;
	};

	for (const line of lines) {
		if (CLOSE_RE.test(line)) {
			flush();
			break;
		}
		if (HEAD_RE.test(line)) {
			flush();
			collectingLabel = true;
			labelParts = [];
			continue;
		}
		const m = line.match(ART_RE);
		if (m) {
			flush();
			cur = {
				number: m[1],
				parts: [m[2]],
				label: labelParts.length ? commaFix(fixCase(labelParts.join(' '))) : undefined
			};
			collectingLabel = false;
			labelParts = [];
			continue;
		}
		if (collectingLabel) {
			if (!NOTE_RE.test(line) && line.length <= 90) labelParts.push(line);
			continue;
		}
		if (cur) cur.parts.push(line);
	}
	flush();
	return articles;
}

const localArg = process.argv[2];
const html = await loadHtml(localArg);
const articles = parseConstituicao(html);

const base = articles.map((a) => a.number).filter((n) => /^\d+$/.test(n)).map(Number);
const missing: number[] = [];
for (let i = 1; i <= 250; i++) if (!base.includes(i)) missing.push(i);
if (articles.length < 250 || missing.length > 0) {
	throw new Error(`Parse looks incomplete: ${articles.length} articles, missing 1..250: ${missing.join(',') || 'none'}`);
}

await writeFile(OUT_PATH, JSON.stringify(articles, null, '\t') + '\n');
console.log(`Wrote ${articles.length} articles to ${OUT_PATH.pathname}`);
