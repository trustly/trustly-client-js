


import { java, JavaObject } from "jree";




export  class NotificationArgs<D extends IRequestParamsData> extends JavaObject {

  public static

   interface NotificationOkHandler {

     handle(method: string| null, uuid: string| null): void;
  }

  public static

   interface NotificationFailHandler {

     handle(method: string| null, uuid: string| null, message: string| null): void;
  }

  private readonly data:  D | null;

  private readonly method?: string;
  private readonly uuid?: string;

  private readonly onOK:  NotificationArgs.NotificationOkHandler | null;
  private readonly onFailed:  NotificationArgs.NotificationFailHandler | null;

  public respondWithOk():  void {
    this.onOK.handle(this.method, this.uuid);
  }

  public respondWithFailed(message: string| null):  void {
    this.onFailed.handle(this.method, this.uuid, message);
  }
}
