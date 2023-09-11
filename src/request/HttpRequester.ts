import {TrustlyApiClientSettingsData} from '../client/TrustlyApiClientSettings';

export interface HttpRequester {

  request(settings: TrustlyApiClientSettingsData, request: string): Promise<string>;
}
