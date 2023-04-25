import {IResponseResultData} from './IResponseResultData';
import {SignatureOwner} from './SignatureOwner';

export interface ResponseResult<D extends IResponseResultData> extends SignatureOwner {

  signature: string;

  uuid: string;

  method: string;

  data: D;
}
