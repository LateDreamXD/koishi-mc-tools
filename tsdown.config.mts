import { defineConfig } from 'tsdown';

export default defineConfig({
	format: 'cjs',
	target: 'node20',
	platform: 'node',
	fixedExtension: false
});