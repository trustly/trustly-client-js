import {IResponseResultData} from './IResponseResultData';
import {ResponseResult} from './ResponseResult';
import {ResponseError} from './ResponseError';
import {IData} from './IData';

export class JsonRpcResponse<D extends IResponseResultData> {

  public readonly version: string;
  public result?: ResponseResult<D>;
  public error?: ResponseError;

  constructor(result: ResponseResult<D> | undefined, error?: ResponseError, version = '1.1') {
    this.version = version;
    if (result) {
      this.result = result;
    }
    if (error) {
      this.error = error;
    }
  }

  public isSuccessfulResult(): boolean {
    return this.result !== null && this.error === null;
  }

  public getUUID(): string | undefined {
    return this.isSuccessfulResult() ? this.result?.uuid : this.error?.error?.uuid;
  }

  public getData(): IData | undefined {
    if (this.isSuccessfulResult()) {
      return this.result?.data;
    } else {
      return this.error?.error?.data;
    }
  }

  public getMethod(): string | undefined {
    return this.isSuccessfulResult() ? this.result?.method : this.error?.error?.method;
  }

  public getSignature(): string | undefined {
    return this.isSuccessfulResult() ? this.result?.signature : this.error?.error?.signature;
  }
}
