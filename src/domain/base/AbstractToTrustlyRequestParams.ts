import {IRequestParams} from './IRequestParams';
import {IData} from './IData';

export abstract class AbstractToTrustlyRequestParams<D extends IData> implements IRequestParams<D> {

  public signature: string;

  public uuid: string;

  public data: D;

  protected constructor(signature: string, uuid: string, data: D) {
    this.signature = signature;
    this.uuid = uuid;
    this.data = data;
  }

  abstract getSignature(): string;

  abstract getUuid(): string;

  abstract withSignature(value: string): this;
}
