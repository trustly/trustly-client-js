import {IResponseResultData} from './IResponseResultData';
import {ResponseResult} from './ResponseResult';
import {ResponseError} from './ResponseError';

export interface JsonRpcResponseBase {
  readonly version: '1.1' | string;
}

export interface JsonRpcResponseWithResult<D extends IResponseResultData> extends JsonRpcResponseBase {
  readonly result: ResponseResult<D>;
  readonly error?: never;
}

export interface JsonRpcResponseWithError extends JsonRpcResponseBase {
  readonly result?: never;
  readonly error: ResponseError;
}

export type JsonRpcResponse<D extends IResponseResultData> = JsonRpcResponseWithResult<D> | JsonRpcResponseWithError;
