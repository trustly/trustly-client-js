
import { java, JavaObject } from "jree";




export  class ApacheHttpClient5HttpRequesterLoader extends JavaObject extends  HttpRequesterLoader {

  public create():  HttpRequester | null {

    try {
      java.lang.Class.forName("org.apache.hc.client5.http.impl.classic.HttpClients");
      return new  ApacheHttpClient5HttpRequester();
    } catch (e) {
if (e instanceof java.lang.ClassNotFoundException) {
      return null;
    } else {
	throw e;
	}
}
  }
}
