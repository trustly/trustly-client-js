import {IResponseResultData} from './IResponseResultData';

export interface ResponseResult<D extends IResponseResultData> {

  signature?: string;

  uuid?: string;

  method?: string;

  data?: D;
}
