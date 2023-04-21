
import { java, JavaObject } from "jree";




export  class ApacheHttpClient4HttpRequesterLoader extends JavaObject extends  HttpRequesterLoader {

  public create():  HttpRequester | null {

    try {
      java.lang.Class.forName("org.apache.http.HttpEntity");
      java.lang.Class.forName("org.apache.http.client.HttpClient");
      return new  ApacheHttpClient4HttpRequester();
    } catch (e) {
if (e instanceof java.lang.ClassNotFoundException) {
      return null;
    } else {
	throw e;
	}
}
  }
}
