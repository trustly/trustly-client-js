


import { java, JavaObject } from "jree";




export  class ApacheHttpClient5HttpRequester extends JavaObject extends  HttpRequester {

  private httpClient:  java.net.http.HttpClient | null;

  public request(settings: TrustlyApiClientSettings| null, request: string| null):  string | null {

    if (this.httpClient === null) {
      this.httpClient = HttpClients.createDefault();
    }

     const  httpPost: HttpPost = new  HttpPost(settings.getUrl());
    httpPost.setEntity(HttpEntities.create(request, ContentType.APPLICATION_JSON));

    return this.httpClient.execute(httpPost, new  BasicHttpClientResponseHandler());
  }
}
