import {IResponseResultData} from './IResponseResultData';
import {ResponseResult} from './ResponseResult';
import {ResponseError} from './ResponseError';
import {IData} from './IData';

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

export type JsonRpcResponse<D extends IResponseResultData> = JsonRpcResponseWithResult<D> | JsonRpcResponseWithError

export class JsonRpcResponseUtils {

  public isSuccessfulResult<R extends JsonRpcResponse<IResponseResultData>>(response: R): boolean {
    return !!response.result && !response.error;
  }

  public getUUID<R extends JsonRpcResponse<IResponseResultData>>(response: R): string | undefined {
    return this.isSuccessfulResult(response) ? response.result?.uuid : response.error?.error?.uuid;
  }

  public getData<R extends JsonRpcResponse<IResponseResultData>>(response: R): IData | undefined {
    if (this.isSuccessfulResult(response)) {
      return response.result?.data;
    } else {
      return response.error?.error?.data;
    }
  }

  public getMethod<R extends JsonRpcResponse<IResponseResultData>>(response: R): string | undefined {
    return this.isSuccessfulResult(response) ? response.result?.method : response.error?.error?.method;
  }

  public getSignature<R extends JsonRpcResponse<IResponseResultData>>(response: R): string | undefined {
    return this.isSuccessfulResult(response) ? response.result?.signature : response.error?.error?.signature;
  }
}
