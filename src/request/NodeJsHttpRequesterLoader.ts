import {HttpRequesterLoader} from './HttpRequesterLoader';
import {HttpRequester} from './HttpRequester';
import {NodeJsHttpRequester} from './NodeJsHttpRequester';

export class NodeJsHttpRequesterLoader implements HttpRequesterLoader {

  public create(): HttpRequester {
    return new NodeJsHttpRequester();
  }
}
