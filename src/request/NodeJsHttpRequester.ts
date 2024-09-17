import {HttpRequester} from './HttpRequester';
import {TrustlyApiClientSettingsData} from '../client/TrustlyApiClientSettings';
import * as https from 'https';
import * as http from "node:http";

export class NodeJsHttpRequester implements HttpRequester {

  private readonly _baseRequestOptions?: http.RequestOptions;

  /**
   * Optionally give base request options. Useful if you need support for proxy requests. Proxy requests are supported by:
   * - Setting the `url` of the `TrustlyApiClientSettings` to the proxy address.
   * - Setting the `path` of the `http.RequestOptions` to the actual target path.
   * - Adding a `HOST` header to `http.RequestOptions.headers` that points to the actual target host.
   */
  constructor(baseRequestOptions?: http.RequestOptions) {
    if (baseRequestOptions) {
      this._baseRequestOptions = baseRequestOptions;
    }
  }

  public async request(settings: TrustlyApiClientSettingsData, request: string): Promise<string> {

    return new Promise((resolve, reject) => {

      const client = settings.url.startsWith('https:') ? https : http;
      const https_request = client.request(
        new URL(settings.url),
        {
          ...this._baseRequestOptions,
          method: 'POST',
          headers: {
            ...this._baseRequestOptions?.headers,
            'Content-Type': 'application/json',
            'Content-Length': String(new TextEncoder().encode(request).length),
          },
        },
        response => {

          let data = '';
          response.on('data', chunk => {
            if (typeof chunk == 'string') {
              data += chunk;
            } else if (chunk instanceof Buffer || chunk instanceof Uint8Array) {
              data += chunk.toString();
            } else {
              reject(new Error(`Do not know how to handle the responded-with type '${typeof chunk}'`));
            }
          });

          response.on('end', () => {
            resolve(data);
          });

          response.on('error', error => {
            reject(new Error(`${error.name}: ${error.message}`, {cause: error}));
          })
        }
      );

      https_request.on('error', error => {
        reject(new Error(`${error.name}: ${error.message}`, {cause: error}));
      });

      https_request.write(request);
      https_request.end();
    });
  }
}
