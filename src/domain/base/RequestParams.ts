import {IRequestParams} from './IRequestParams';
import {IRequestParamsData} from './IRequestParamsData';

export class RequestParams<D extends IRequestParamsData> implements IRequestParams<D> {

  public signature: string;
  public uuid: string;
  public data: D;

  constructor(signature: string, uuid: string, data: D) {
    this.signature = signature;
    this.uuid = uuid;
    this.data = data;
  }

  withSignature(value: string): this {
    return {
      ...this,
      signature: value,
    };
  }
}
