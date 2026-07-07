import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Executable form of the robots policy in docs/AGENT-DISCOVERY.md:
// AI training/scraping crawlers are disallowed; user-triggered agent
// fetchers and AI search indexers from OpenAI and Anthropic are allowed.
// Change the policy file and this test together.

const ALLOWED_AGENTS = [
	'*',
	'ChatGPT-User',
	'OAI-SearchBot',
	'Claude-User',
	'Claude-Web',
	'Claude-SearchBot'
];

const DISALLOWED_AGENTS = [
	'GPTBot',
	'ClaudeBot',
	'anthropic-ai',
	'CCBot',
	'Google-Extended',
	'PerplexityBot',
	'Applebot-Extended',
	'Bytespider',
	'Amazonbot',
	'Meta-ExternalAgent'
];

/** Parse robots.txt into user-agent → disallow values (one group per agent). */
function parseRobots(text: string): Map<string, string[]> {
	const groups = new Map<string, string[]>();
	let current: string[] = [];
	for (const raw of text.split('\n')) {
		const line = raw.replace(/#.*$/, '').trim();
		const [field, ...rest] = line.split(':');
		const value = rest.join(':').trim();
		if (!line.includes(':')) continue;
		if (field.trim().toLowerCase() === 'user-agent') {
			current = groups.get(value) ?? [];
			groups.set(value, current);
		} else if (field.trim().toLowerCase() === 'disallow') {
			current.push(value);
		}
	}
	return groups;
}

const robots = parseRobots(readFileSync('static/robots.txt', 'utf8'));

test('user-triggered agent fetchers and AI search are allowed', () => {
	for (const agent of ALLOWED_AGENTS) {
		const disallows = robots.get(agent);
		assert.ok(disallows, `expected an explicit group for ${agent}`);
		assert.deepEqual(disallows, [''], `${agent} must have an empty Disallow (allow all)`);
	}
});

test('training/scraping crawlers are disallowed', () => {
	for (const agent of DISALLOWED_AGENTS) {
		assert.deepEqual(robots.get(agent), ['/'], `${agent} must be disallowed entirely`);
	}
});
