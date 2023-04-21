import {IFromTrustlyRequestData} from './IFromTrustlyRequestData';
import {IRequestParams} from './IRequestParams';

export class NotificationRequestParams<D extends IFromTrustlyRequestData> implements IRequestParams<D> {

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
