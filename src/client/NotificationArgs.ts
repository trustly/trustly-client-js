import {IRequestParamsData} from '../domain/base/IRequestParamsData';

export type NotificationOkHandler = (method: string, uuid: string) => Promise<void>;

export type NotificationFailHandler = (method: string, uuid: string, message: string) => Promise<void>;

export class NotificationArgs<D extends IRequestParamsData> {

  readonly data: D;

  readonly method: string;
  readonly uuid: string;

  readonly onOK?: NotificationOkHandler;
  readonly onFailed?: NotificationFailHandler;

  constructor(data: D, method: string, uuid: string, onOK?: NotificationOkHandler, onFailed?: NotificationFailHandler) {
    this.data = data;
    this.method = method;
    this.uuid = uuid;
    if (onOK) {
      this.onOK = onOK;
    }

    if (onFailed) {
      this.onFailed = onFailed;
    }
  }

  public respondWithOk(): Promise<void> {
    if (this.onOK) {
      return this.onOK(this.method, this.uuid);
    } else {
      return Promise.resolve();
    }
  }

  public respondWithFailed(message: string): Promise<void> {
    if (this.onFailed) {
      return this.onFailed(this.method, this.uuid, message);
    } else {
      return Promise.resolve();
    }
  }
}
