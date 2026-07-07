import { test } from 'node:test';
import assert from 'node:assert/strict';
import { camaraFetchEnvelope, CamaraApiError, type FetchLike } from '$lib/server/camara/client';

test('a hung upstream (timeout abort) becomes a CamaraApiError', async () => {
	const fetchImpl: FetchLike = async () => {
		throw new DOMException('The operation timed out.', 'TimeoutError');
	};

	await assert.rejects(
		camaraFetchEnvelope('/proposicoes', undefined, fetchImpl),
		(err: unknown) => err instanceof CamaraApiError
	);
});

test('an unreadable or malformed body becomes a CamaraApiError, not a raw exception', async () => {
	const fetchImpl: FetchLike = async () =>
		new Response('not json', { status: 200, headers: { 'Content-Type': 'application/json' } });

	await assert.rejects(
		camaraFetchEnvelope('/proposicoes', undefined, fetchImpl),
		(err: unknown) => err instanceof CamaraApiError
	);
});

test('Câmara requests carry an abort signal so a hang cannot stall the render', async () => {
	let signal: AbortSignal | null | undefined;
	const fetchImpl: FetchLike = async (_input, init) => {
		signal = init?.signal;
		return new Response(JSON.stringify({ dados: [], links: [] }), { status: 200 });
	};

	await camaraFetchEnvelope('/proposicoes', undefined, fetchImpl);
	assert.ok(signal instanceof AbortSignal);
});
