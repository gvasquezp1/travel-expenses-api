import {
  app as azureApp,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { Readable } from 'stream';
import { ServerResponse } from 'http';
import { bootstrap } from '../serverless-handler';
import type { Application } from 'express';

async function bridgeRequest(
  azureReq: HttpRequest,
  expressApp: Application,
): Promise<HttpResponseInit> {
  const url = new URL(azureReq.url);
  const body = Buffer.from(await azureReq.arrayBuffer());

  return new Promise((resolve) => {
    // Mock IncomingMessage using a Readable stream (duck-typed)
    const req = new Readable({ read() {} }) as any;
    req.method = azureReq.method.toUpperCase();
    req.url = url.pathname + (url.search ?? '');
    req.headers = {};
    azureReq.headers.forEach((value: string, key: string) => {
      req.headers[key.toLowerCase()] = value;
    });
    if (body.length > 0) {
      req.headers['content-length'] = String(body.length);
    }

    // Intercept ServerResponse to capture output
    const chunks: Buffer[] = [];
    const res = new ServerResponse(req);
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      const headers: Record<string, string> = {};
      for (const [key, val] of Object.entries(res.getHeaders())) {
        if (val != null) {
          headers[key] = Array.isArray(val) ? val.join(', ') : String(val);
        }
      }
      resolve({ status: res.statusCode, headers, body: Buffer.concat(chunks) });
    };

    (res as any).write = (chunk: any): boolean => {
      if (chunk != null) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
      }
      return true;
    };

    (res as any).end = (chunk?: any): ServerResponse => {
      if (chunk != null && chunk !== '') {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
      }
      finish();
      return res;
    };

    // Dispatch to Express
    expressApp(req, res);

    // Feed body after Express middleware registers its stream listeners
    process.nextTick(() => {
      if (body.length > 0) req.push(body);
      req.push(null);
    });
  });
}

azureApp.http('httpTrigger', {
  methods: ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'],
  authLevel: 'anonymous',
  route: '{*route}',
  handler: async (
    request: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> => {
    const expressApp = await bootstrap();
    return bridgeRequest(request, expressApp);
  },
});
