import {ResponseErrorData} from './ResponseErrorData';
import {ResponseResult} from './ResponseResult';

export interface ResponseError extends ResponseErrorData {

  name?: string;

  error?: ResponseResult<ResponseErrorData>;

  // public code?: number;

  // public message?: string;
}
