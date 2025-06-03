import {HttpRequester} from './HttpRequester';
import {TrustlyApiClientSettingsData} from '../client/TrustlyApiClientSettings';
import * as http from 'http';
import * as https from 'https';

export class NodeJsHttpRequester implements HttpRequester {

  public request(settings: TrustlyApiClientSettingsData, request: string): Promise<string> {

    return new Promise((resolve, reject) => {

      const client = settings.url.startsWith('https:') ? https : http;
      const https_request = client.request(
        new URL(settings.url),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(request, 'utf8'),
          },
        },
        response => {

          let data = '';
          response.on('data', chunk => {
            if (typeof chunk == 'string') {
              data += chunk;
            } else if (chunk instanceof Buffer) {
              data += chunk.toString();
            } else if (chunk instanceof Uint8Array) {
              data += chunk.toString();
            } else {
              reject(new Error(`Do not know how to handle the responded with type '${typeof chunk}'`));
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
