import {NotificationAckTypes, NotificationTypes} from "./TrustlyApiClient";

export type NotificationResponseHandler<M extends string> =
  (method: M, uuid: string, response: NotificationAckTypes[M]) => Promise<void>;

export class NotificationArgs<M extends string> {

  readonly data: NotificationTypes[M];
  readonly method: M;
  readonly uuid: string;

  readonly onResponse?: NotificationResponseHandler<M>;

  constructor(method: M, data: NotificationTypes[M], uuid: string, onResponse?: NotificationResponseHandler<M>) {
    this.data = data;
    this.method = method;
    this.uuid = uuid;
    this.onResponse = onResponse;
  }

  public respondWith(response: NotificationAckTypes[M]): Promise<void> {
    if (this.onResponse) {
      return this.onResponse(this.method, this.uuid, response);
    } else {
      return Promise.resolve();
    }
  }
}
