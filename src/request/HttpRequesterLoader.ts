import {HttpRequester} from './HttpRequester';

export interface HttpRequesterLoader {

  create(): HttpRequester | undefined;
}
