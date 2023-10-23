import {IFromTrustlyRequestData} from '../domain/base/IFromTrustlyRequestData';
import {NotificationArgs} from './NotificationArgs';

export type NotificationListener<D extends IFromTrustlyRequestData> = (args: NotificationArgs<D>) => Promise<void>;
