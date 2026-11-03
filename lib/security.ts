import { env } from 'cloudflare:workers';
export function isStaff(req:Request) { const key = (env as any).PHARMACY_KEY; return !!key && req.headers.get('cookie')?.split(';').some(x=>x.trim()===`pharmacy=${key}`); }
export function sameOrigin(req:Request){const origin=req.headers.get('origin');return origin===new URL(req.url).origin;}
export const privateHeaders={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
