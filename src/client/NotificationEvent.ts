


import { java } from "jree";




 interface NotificationEvent<D extends IFromTrustlyRequestData> {

   onNotification(args: NotificationArgs<D>| null): void;
}
