import { build } from 'vite';
import { resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

const api = new URL(process.env.PRESCRIPTION_API_ORIGIN || (() => {
  throw new Error('Set PRESCRIPTION_API_ORIGIN to the new prescription API Worker HTTPS origin.');
})());
if (api.protocol !== 'https:' || api.href !== api.origin + '/') throw new Error('Expected an HTTPS origin.');
const output = resolve('.vercel/output');
await build({
  configFile: false,
  root: resolve('deploy/web'),
  publicDir: resolve('public'),
  resolve: { alias: { '@': resolve('.') } },
  build: { outDir: resolve(output, 'static'), emptyOutDir: true }
});
await mkdir(output, { recursive: true });
await writeFile(resolve(output, 'config.json'), JSON.stringify({
  version: 3,
  routes: [
    { src: '/api/(.*)', dest: api.origin + '/api/$1', headers: { 'Cache-Control': 'private, no-store' } },
    { handle: 'filesystem' },
    { src: '/(?:pharmacy/?|print/[^/]+/?)', dest: '/index.html' }
  ]
}));

