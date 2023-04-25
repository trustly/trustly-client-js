import {HttpRequester} from './HttpRequester';
import {HttpRequesterLoader} from './HttpRequesterLoader';
import {ApacheHttpClient3HttpRequester} from './ApacheHttpClient3HttpRequester';

export class ApacheHttpClient3HttpRequesterLoader implements HttpRequesterLoader {

  public create(): HttpRequester {

    try {
      java.lang.Class.forName('org.apache.commons.httpclient.HttpClient');
      return new ApacheHttpClient3HttpRequester();
    } catch (e) {
      if (e instanceof java.lang.ClassNotFoundException) {
        return null;
      } else {
        throw e;
      }
    }
  }
}
