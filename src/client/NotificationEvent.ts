import {IFromTrustlyRequestData} from '../domain/base/IFromTrustlyRequestData';
import {NotificationArgs} from './NotificationArgs';

export interface NotificationEvent<D extends IFromTrustlyRequestData> {

  onNotification(args: NotificationArgs<D>): void;
}
