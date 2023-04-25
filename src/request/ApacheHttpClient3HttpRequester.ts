import {TrustlyApiClientSettings} from '../client/TrustlyApiClientSettings';
import {HttpRequester} from './HttpRequester';
import {TrustlyStreamUtils} from '../util/TrustlyStreamUtils';

export class ApacheHttpClient3HttpRequester implements HttpRequester {

  private httpClient: java.net.http.HttpClient | null;

  public request(settings: TrustlyApiClientSettings, request: string): string {

    if (this.httpClient === null) {
      this.httpClient = new java.net.http.HttpClient();
    }

    const requestEntity: StringRequestEntity = new StringRequestEntity(request, 'application/json', 'UTF-8');

    const postMethod: PostMethod = new PostMethod(settings.getUrl());
    postMethod.setRequestEntity(requestEntity);

    const statusCode: int = this.httpClient.executeMethod(postMethod);

    let charset: string = postMethod.getResponseCharSet();
    if (charset === null) {
      charset = java.nio.charset.StandardCharsets.UTF_8.name();
    }

    const sr: java.io.Reader = new java.io.InputStreamReader(postMethod.getResponseBodyAsStream(), charset);
    const responseBody: string = TrustlyStreamUtils.readerToString(sr);

    if (statusCode > 299) {
      throw new java.io.IOException(string.format('Received error response %d: %s', statusCode, responseBody));
    }

    return responseBody;
  }
}
