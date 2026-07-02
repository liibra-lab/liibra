import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { cachedFetch } from '$lib/server/edge-cache';

// Minimal stand-in for the Workers `caches.default` object.
class FakeCache {
	store = new Map<string, Response>();
	async match(url: string): Promise<Response | undefined> {
		return this.store.get(String(url))?.clone();
	}
	async put(url: string, response: Response): Promise<void> {
		this.store.set(String(url), response);
	}
}

function installFakeCache(): FakeCache {
	const fake = new FakeCache();
	(globalThis as { caches?: unknown }).caches = { default: fake };
	return fake;
}

afterEach(() => {
	delete (globalThis as { caches?: unknown }).caches;
});

const URL_A = 'https://upstream.example/resource';

function fetchCounting(counter: { calls: number }, status = 200): typeof fetch {
	return async () => {
		counter.calls += 1;
		return new Response(`body ${counter.calls}`, { status });
	};
}

test('without a cache, every call goes to the network', async () => {
	const counter = { calls: 0 };
	await cachedFetch(URL_A, {}, fetchCounting(counter));
	await cachedFetch(URL_A, {}, fetchCounting(counter));
	assert.equal(counter.calls, 2);
});

test('a cached response is served without re-fetching', async () => {
	installFakeCache();
	const counter = { calls: 0 };
	const first = await cachedFetch(URL_A, {}, fetchCounting(counter));
	assert.equal(await first.text(), 'body 1');

	const second = await cachedFetch(URL_A, {}, fetchCounting(counter));
	assert.equal(counter.calls, 1);
	assert.equal(await second.text(), 'body 1');
	assert.match(second.headers.get('cache-control') ?? '', /max-age=300/);
});

test('non-ok responses are returned but never cached', async () => {
	const fake = installFakeCache();
	const counter = { calls: 0 };
	const response = await cachedFetch(URL_A, {}, fetchCounting(counter, 502));
	assert.equal(response.status, 502);
	assert.equal(fake.store.size, 0);

	await cachedFetch(URL_A, {}, fetchCounting(counter, 502));
	assert.equal(counter.calls, 2);
});

test('a broken cache falls through to the network', async () => {
	(globalThis as { caches?: unknown }).caches = {
		default: {
			match: async () => {
				throw new Error('cache exploded');
			},
			put: async () => {
				throw new Error('cache exploded');
			}
		}
	};
	const counter = { calls: 0 };
	const response = await cachedFetch(URL_A, {}, fetchCounting(counter));
	assert.equal(response.status, 200);
	assert.equal(counter.calls, 1);
});
