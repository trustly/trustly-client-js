import {HttpRequesterLoader} from "./HttpRequesterLoader";
import {HttpRequester} from "./HttpRequester";
import {FetchHttpRequester} from "./FetchHttpRequester";

export class FetchHttpRequesterLoader implements HttpRequesterLoader {

  public create(): HttpRequester | undefined {

    if (typeof fetch === 'undefined') {
      return undefined;
    }

    return new FetchHttpRequester();
  }
}
