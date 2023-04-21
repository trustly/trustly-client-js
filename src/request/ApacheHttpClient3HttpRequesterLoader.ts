
import { java, JavaObject } from "jree";




export  class ApacheHttpClient3HttpRequesterLoader extends JavaObject extends  HttpRequesterLoader {

  public create():  HttpRequester | null {

    try {
      java.lang.Class.forName("org.apache.commons.httpclient.HttpClient");
      return new  ApacheHttpClient3HttpRequester();
    } catch (e) {
if (e instanceof java.lang.ClassNotFoundException) {
      return null;
    } else {
	throw e;
	}
}
  }
}
