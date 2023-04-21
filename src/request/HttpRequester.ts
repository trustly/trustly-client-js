import {TrustlyApiClientSettings} from '../client/TrustlyApiClientSettings';

export interface HttpRequester {

  request(settings: TrustlyApiClientSettings, request: string): string;
}
