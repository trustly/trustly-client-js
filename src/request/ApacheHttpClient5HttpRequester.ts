import {HttpRequester} from './HttpRequester';
import {TrustlyApiClientSettings} from '../client/TrustlyApiClientSettings';


export  class ApacheHttpClient5HttpRequester implements  HttpRequester {

  private httpClient:  java.net.http.HttpClient | null;

  public request(settings: TrustlyApiClientSettings, request: string):  string {

    if (this.httpClient === null) {
      this.httpClient = HttpClients.createDefault();
    }

     const  httpPost: HttpPost = new  HttpPost(settings.getUrl());
    httpPost.setEntity(HttpEntities.create(request, ContentType.APPLICATION_JSON));

    return this.httpClient.execute(httpPost, new  BasicHttpClientResponseHandler());
  }
}
