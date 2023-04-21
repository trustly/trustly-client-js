


import { java, JavaObject } from "jree";




export  class ApacheHttpClient4HttpRequester extends JavaObject extends  HttpRequester {

  private httpClient:  CloseableHttpClient | null;

  public request(settings: TrustlyApiClientSettings| null, request: string| null):  string | null {

    if (this.httpClient === null) {
      this.httpClient = HttpClients.createDefault();
    }

    const  requestEntity: StringEntity = new  StringEntity(request, ContentType.APPLICATION_JSON);

    const  postMethod: HttpPost = new  HttpPost(settings.getUrl());
    postMethod.setEntity(requestEntity);

    const  response: java.net.http.HttpResponse = this.httpClient.execute(postMethod);

    const  entity: HttpEntity = response.getEntity();
    return EntityUtils.toString(entity, java.nio.charset.StandardCharsets.UTF_8);
  }
}
