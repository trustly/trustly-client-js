import {IRequestParamsData} from '../domain/base/IRequestParamsData';

export type NotificationOkHandler = (method: string, uuid: string) => void;
//   handle(method: string, uuid: string): void;
// }

export type NotificationFailHandler = (method: string, uuid: string, message: string) => void;
//   handle: void;
// }

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

  public respondWithOk(): void {
    if (this.onOK) {
      this.onOK(this.method, this.uuid);
    }
  }

  public respondWithFailed(message: string): void {
    if (this.onFailed) {
      this.onFailed(this.method, this.uuid, message);
    }
  }
}
