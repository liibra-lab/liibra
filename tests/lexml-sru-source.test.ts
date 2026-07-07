import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LexmlSruSource, type FetchLike } from '$lib/server/legal/lexml-sru-source';

const source = new LexmlSruSource();

test('a hung upstream (timeout abort) degrades into source_unavailable', async () => {
	const fetchImpl: FetchLike = async () => {
		throw new DOMException('The operation timed out.', 'TimeoutError');
	};

	const response = await source.search({ q: 'lei' }, fetchImpl);
	assert.equal(response.items.length, 0);
	assert.ok(response.warnings?.includes('source_unavailable'));
});

test('a timeout abort during the body read degrades into source_unavailable', async () => {
	const fetchImpl: FetchLike = async () =>
		new Response(
			new ReadableStream({
				pull(controller) {
					controller.error(new DOMException('The operation timed out.', 'TimeoutError'));
				}
			}),
			{ status: 200 }
		);

	const response = await source.search({ q: 'lei' }, fetchImpl);
	assert.equal(response.items.length, 0);
	assert.ok(response.warnings?.includes('source_unavailable'));
});

test('SRU requests carry an abort signal so a hang cannot stall the render', async () => {
	let signal: AbortSignal | null | undefined;
	const fetchImpl: FetchLike = async (_input, init) => {
		signal = init?.signal;
		return new Response('<srw:searchRetrieveResponse/>', { status: 200 });
	};

	await source.search({ q: 'lei' }, fetchImpl);
	assert.ok(signal instanceof AbortSignal);
});
