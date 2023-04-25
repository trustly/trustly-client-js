import {HttpRequesterLoader} from './HttpRequesterLoader';
import {HttpRequester} from './HttpRequester';
import {ApacheHttpClient5HttpRequester} from './ApacheHttpClient5HttpRequester';


export class ApacheHttpClient5HttpRequesterLoader implements HttpRequesterLoader {

  public create(): HttpRequester | null {

    try {
      java.lang.Class.forName('org.apache.hc.client5.http.impl.classic.HttpClients');
      return new ApacheHttpClient5HttpRequester();
    } catch (e) {
      if (e instanceof java.lang.ClassNotFoundException) {
        return null;
      } else {
        throw e;
      }
    }
  }
}
