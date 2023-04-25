import {HttpRequesterLoader} from './HttpRequesterLoader';
import {HttpRequester} from './HttpRequester';
import {JavaUrlConnectionHttpRequester} from './JavaUrlConnectionHttpRequester';

export class JavaUrlConnectionHttpRequesterLoader implements HttpRequesterLoader {

  public create(): HttpRequester {
    return new JavaUrlConnectionHttpRequester();
  }
}
