import {NotificationArgs} from './NotificationArgs';

export type NotificationListener<M extends string> = (args: NotificationArgs<M>) => Promise<void>;
