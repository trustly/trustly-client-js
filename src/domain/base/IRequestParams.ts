import {IData} from './IData';
import {SignatureOwner} from './SignatureOwner';

export interface IRequestParams<D extends IData> extends SignatureOwner {

  readonly Signature: string;

  readonly UUID: string;

  readonly Data: D;
}

// export interface IResponseParams<D extends IData> extends ResponseSignatureOwner {
//
//   readonly signature: string;
//
//   readonly uuid: string;
//
//   readonly data: D;
// }
