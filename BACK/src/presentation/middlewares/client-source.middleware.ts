import { Request, Response, NextFunction } from 'express';

export type ClientSource = 'web' | 'mobile_ios' | 'mobile_android' | 'unknown';

export interface ClientSourceRequest extends Request {
  clientSource?: ClientSource;
}

export class ClientSourceMiddleware {
  static detect(req: ClientSourceRequest, res: Response, next: NextFunction): void {
    const userAgent = req.headers['user-agent'] || '';
    const sourceHeader = req.headers['x-client-source'] as string;

    let clientSource: ClientSource = 'unknown';

    if (sourceHeader) {
      const validSources: ClientSource[] = ['web', 'mobile_ios', 'mobile_android'];
      if (validSources.includes(sourceHeader as ClientSource)) {
        clientSource = sourceHeader as ClientSource;
      }
    } else {
      const ua = userAgent.toLowerCase();
      if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
        clientSource = 'mobile_ios';
      } else if (ua.includes('android')) {
        clientSource = 'mobile_android';
      } else if (ua.includes('mozilla') || ua.includes('chrome') || ua.includes('safari')) {
        clientSource = 'web';
      }
    }

    req.clientSource = clientSource;

    console.log(`[Client Source] ${req.method} ${req.path} - Source: ${clientSource} - UA: ${userAgent.substring(0, 50)}`);

    next();
  }
}
