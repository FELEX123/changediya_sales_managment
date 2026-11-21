import { GET as listOrders, POST as changeOrder } from '../app/api/pharmacy/route';
import { POST as submitOrder } from '../app/api/orders/route';
import { GET as readFile } from '../app/api/files/route';

export default {
  async fetch(request: Request, env: { FRONTEND_ORIGIN: string }) {
    const url = new URL(request.url);
    // The browser sends its Vercel origin through the external rewrite.
    if (request.method === 'POST') {
      if (!env.FRONTEND_ORIGIN || request.headers.get('Origin') !== env.FRONTEND_ORIGIN)
        return new Response(null, { status: 403 });
      const headers = new Headers(request.headers);
      headers.set('Origin', url.origin);
      request = new Request(request, { headers });
    }
    if (url.pathname === '/api/orders' && request.method === 'POST') return submitOrder(request);
    if (url.pathname === '/api/pharmacy') {
      if (request.method === 'GET') return listOrders(request);
      if (request.method === 'POST') return changeOrder(request);
    }
    if (request.method === 'GET' && url.pathname === '/api/files') return readFile(request);
    if (request.method === 'GET' && url.pathname.startsWith('/api/files/')) {
      url.searchParams.set('key', decodeURIComponent(url.pathname.slice('/api/files/'.length)));
      return readFile(new Request(url, request));
    }
    return new Response(null, { status: 404 });
  }
};
