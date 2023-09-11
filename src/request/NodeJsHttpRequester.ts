import {HttpRequester} from './HttpRequester';
import {TrustlyApiClientSettingsData} from '../client/TrustlyApiClientSettings';
import * as http from 'http';

export class NodeJsHttpRequester implements HttpRequester {

  public request(settings: TrustlyApiClientSettingsData, request: string): Promise<string> {

    return new Promise((resolve, reject) => {

      const http_request = http.request(
        settings.url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': request.length,
          },
        },
        response => {

          response.on('data', data => {
            if (typeof data == 'string') {
              resolve(data);
            } else {
              reject(new Error(`Do not know how to handle the responded with type '${typeof data}'`));
            }
          });

          response.on('error', error => {
            reject(new Error(`${error.name}: ${error.message}`, {cause: error}));
          })
        }
      );

      http_request.on('error', error => {
        reject(new Error(`${error.name}: ${error.message}`, {cause: error}));
      });

      http_request.write(request);
      http_request.end();
    });
  }
}
