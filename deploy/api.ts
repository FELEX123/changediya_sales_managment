import { GET as listOrders, POST as changeOrder } from '../app/api/pharmacy/route';
import { POST as submitOrder } from '../app/api/orders/route';
import { GET as readFile } from '../app/api/files/route';

export default {
  async fetch(request: Request) {
    const url = new URL(request.url);
    // Cross-origin browser requests with this header require a preflight, which this API denies.
    if (request.method === 'POST') {
      if (request.headers.get('X-Pharmacy-Request') !== '1' || request.headers.get('Sec-Fetch-Site') === 'cross-site')
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
