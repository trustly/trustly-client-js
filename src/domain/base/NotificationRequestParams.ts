import {IFromTrustlyRequestData} from './IFromTrustlyRequestData';
import {ResponseSignatureOwner} from "./SignatureOwner";

export class NotificationRequestParams<D extends IFromTrustlyRequestData> implements ResponseSignatureOwner {

  public signature: string;
  public uuid: string;
  public data: D;

  constructor(signature: string, uuid: string, data: D) {
    this.signature = signature;
    this.uuid = uuid;
    this.data = data;
  }
}
