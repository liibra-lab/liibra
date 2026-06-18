// Registers the TypeScript-aware resolve hook for the test runner.
import { register } from 'node:module';
register('./ts-resolve.mjs', import.meta.url);
