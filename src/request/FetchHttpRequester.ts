import {HttpRequester} from './HttpRequester';
import {TrustlyApiClientSettingsData} from '../client/TrustlyApiClientSettings';

export class FetchHttpRequester implements HttpRequester {

  private readonly _baseRequestOptions?: Partial<RequestInit>;

  /**
   * Optionally give base request options. Useful if you need support for proxy requests.
   */
  constructor(baseRequestOptions?: Partial<Omit<RequestInit, 'body' | 'method'>>) {
    if (baseRequestOptions) {
      this._baseRequestOptions = baseRequestOptions;
    }
  }

  public async request(settings: TrustlyApiClientSettingsData, request: string): Promise<string> {

    const options: RequestInit = {
      ...this._baseRequestOptions,
      method: 'POST',
      body: request,
      headers: {
        ...this._baseRequestOptions?.headers,
        'Content-Type': 'application/json',
        'Content-Length': String(new TextEncoder().encode(request).length),
      },
    };

    const response = await fetch(settings.url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}: ${response.statusText}`);
    }

    return response.text();
  }
}
