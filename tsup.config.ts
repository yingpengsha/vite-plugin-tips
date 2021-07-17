import type { Options } from 'tsup'

export const tsup: Options = {
  outDir: 'dist',
  splitting: false,
  clean: true,
  format: ['cjs', 'esm'],
  ignoreWatch: [
    'dist',
    'examples',
  ],
  external: [
    'vite-plugin-tips/dist/client/index.mjs',
  ],
  entryPoints: [
    'src/index.ts',
    'src/client/index.ts',
  ],
}
