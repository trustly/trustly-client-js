import {HttpRequesterLoader} from './HttpRequesterLoader';
import {HttpRequester} from './HttpRequester';
import {NodeJsHttpRequester} from './NodeJsHttpRequester';

export class NodeJsHttpRequesterLoader implements HttpRequesterLoader {

  public create(): HttpRequester | undefined {

    if (!this.isNodeEnvironment()) {
      return undefined;
    }

    return new NodeJsHttpRequester();
  }

  private isNodeEnvironment() {
    return (typeof process !== 'undefined') && (process.release && process.release.name === 'node');
  }
}
