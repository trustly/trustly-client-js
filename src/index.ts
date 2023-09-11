import {TrustlyApiClient} from "./client/TrustlyApiClient";
import {TrustlyApiClientSettingsData} from "./client/TrustlyApiClientSettings";
import {JsonRpcSigner} from "./client/JsonRpcSigner";
import {HttpRequester} from "./request/HttpRequester";

export default (settings: TrustlyApiClientSettingsData, signer?: JsonRpcSigner, httpRequester?: HttpRequester) => {
  return new TrustlyApiClient(settings, signer, httpRequester);
}
