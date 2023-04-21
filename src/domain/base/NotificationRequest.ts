import {IFromTrustlyRequestData} from './IFromTrustlyRequestData';
import {IRequest} from './IRequest';
import {NotificationRequestParams} from './NotificationRequestParams';

export class NotificationRequest<D extends IFromTrustlyRequestData> implements IRequest<NotificationRequestParams<D>> {

  public readonly method: string;
  public readonly version : number;
  public readonly params: NotificationRequestParams<D>;

  constructor(method: string, params: NotificationRequestParams<D>, version = 1.1) {
    this.method = method;
    this.version = version;
    this.params = params;
  }
}
