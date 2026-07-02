import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CamaraPropositionSource, PAGE_SIZE } from '$lib/server/camara/camara-source';
import type { FetchLike } from '$lib/server/camara/client';

const source = new CamaraPropositionSource();

const RAW_ITEM = { id: 1, siglaTipo: 'PL', numero: 123, ano: 2026, ementa: 'Dispõe sobre…' };

function fetchReturning(body: unknown): FetchLike {
	return async () =>
		new Response(JSON.stringify(body), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
}

test('list reads hasNext and totalPages from the envelope links', async () => {
	const fetchImpl = fetchReturning({
		dados: [RAW_ITEM],
		links: [
			{ rel: 'self', href: 'https://api.example/proposicoes?pagina=2&itens=20' },
			{ rel: 'next', href: 'https://api.example/proposicoes?pagina=3&itens=20' },
			{ rel: 'last', href: 'https://api.example/proposicoes?pagina=245&itens=20' }
		]
	});

	const page = await source.list({ page: 2 }, fetchImpl);
	assert.equal(page.items.length, 1);
	assert.equal(page.items[0].id, 1);
	assert.equal(page.hasNext, true);
	assert.equal(page.totalPages, 245);
});

test('list treats a missing next link as the last page', async () => {
	const fetchImpl = fetchReturning({
		dados: [RAW_ITEM],
		links: [
			{ rel: 'self', href: 'https://api.example/proposicoes?pagina=245&itens=20' },
			{ rel: 'last', href: 'https://api.example/proposicoes?pagina=245&itens=20' }
		]
	});

	const page = await source.list({ page: 245 }, fetchImpl);
	assert.equal(page.hasNext, false);
	assert.equal(page.totalPages, 245);
});

test('list tolerates a missing or malformed links array', async () => {
	const noLinks = await source.list({}, fetchReturning({ dados: [RAW_ITEM] }));
	assert.equal(noLinks.hasNext, false);
	assert.equal(noLinks.totalPages, undefined);

	const badHref = await source.list(
		{},
		fetchReturning({ dados: [], links: [{ rel: 'last', href: 'not a url' }] })
	);
	assert.equal(badHref.totalPages, undefined);
});

test('list requests the expected page size', async () => {
	let requested: string | undefined;
	const fetchImpl: FetchLike = async (input) => {
		requested = String(input);
		return new Response(JSON.stringify({ dados: [], links: [] }), { status: 200 });
	};

	await source.list({ page: 3, siglaTipo: 'PEC', ano: 2026 }, fetchImpl);
	const url = new URL(requested!);
	assert.equal(url.searchParams.get('itens'), String(PAGE_SIZE));
	assert.equal(url.searchParams.get('pagina'), '3');
	assert.equal(url.searchParams.get('siglaTipo'), 'PEC');
	assert.equal(url.searchParams.get('ano'), '2026');
});
