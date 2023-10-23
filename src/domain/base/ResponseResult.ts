import {IResponseResultData} from './IResponseResultData';

export interface ResponseResult<D extends IResponseResultData> { //extends SignatureOwner {

  signature: string;

  uuid: string;

  method: string;

  data: D;
}
