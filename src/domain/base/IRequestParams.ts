import {IData} from './IData';
import {SignatureOwner} from './SignatureOwner';

export interface IRequestParams<D extends IData> extends SignatureOwner {

  readonly signature: string;

  readonly uuid: string;

  readonly data: D;
}
