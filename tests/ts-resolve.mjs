// Minimal ESM resolve hook so Node's built-in test runner can import the app's
// real source modules, which use the SvelteKit `$lib` alias and extensionless
// relative imports. No dependency — just maps `$lib/*` to `src/lib/*` and appends
// a `.ts` extension when needed. Type-only imports are erased by
// `--experimental-strip-types`, so only runtime imports reach this hook.

import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const SRC_LIB = path.resolve('src/lib');

function withTs(absPath) {
	if (absPath.endsWith('.ts') || absPath.endsWith('.js') || absPath.endsWith('.json')) {
		return absPath;
	}
	if (existsSync(`${absPath}.ts`)) return `${absPath}.ts`;
	return absPath;
}

export async function resolve(specifier, context, next) {
	if (specifier.startsWith('$lib/')) {
		const abs = withTs(path.join(SRC_LIB, specifier.slice('$lib/'.length)));
		return { url: pathToFileURL(abs).href, shortCircuit: true };
	}

	const isRelative = specifier.startsWith('./') || specifier.startsWith('../');
	const hasExt = /\.(ts|js|json|mjs|cjs)$/.test(specifier);
	if (isRelative && !hasExt && context.parentURL) {
		const parentDir = path.dirname(fileURLToPath(context.parentURL));
		const abs = withTs(path.resolve(parentDir, specifier));
		if (abs.endsWith('.ts')) {
			return { url: pathToFileURL(abs).href, shortCircuit: true };
		}
	}

	return next(specifier, context);
}
