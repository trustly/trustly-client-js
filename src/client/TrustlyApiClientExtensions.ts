import {TrustlyNoNotificationClientException} from '../domain/exceptions/TrustlyNoNotificationClientException';
import {NotificationAckTypes, TrustlyApiClient} from './TrustlyApiClient';

export interface NotificationResponder {

  addHeader(key: string, value: string): void;

  setStatus(httpStatus: number): void;

  writeBody(value: string): Promise<void>;
}

// export class DefaultNotificationResponder implements NotificationResponder {
//
//   private readonly response: http.IncomingMessage;
//
//   public constructor(response: http.IncomingMessage) {
//     this.response = response;
//   }
//
//   public addHeader(key: string, value: string): void {
//     this.response.headers[key] = value;
//   }
//
//   public setStatus(httpStatus: number): void {
//     this.response.statusCode = httpStatus;
//   }
//
//   public writeBody(_value: string): Promise<void> {
//     throw new Error(`Not implemented writing body`);
//   }
// }

export class TrustlyApiClientExtensions {

  // public static handleNotificationToHttp(request: string | ArrayBuffer, response: http.IncomingMessage): Promise<void> {
  //   return TrustlyApiClientExtensions.handleNotificationRequest(request, new DefaultNotificationResponder(response));
  // }

  /**
   * Will deserialize, verify and validate the incoming payload for you.
   * <p>
   * It will then call the appropriate notification listeners for this client only. If the incoming notification method does not have a
   * listener, the {@code Unknown} notification listener will be called.
   * <p>
   * It is up to your listener to call the appropriate {@link NotificationArgs#respondWithOk()} or
   * {@link NotificationArgs#respondWithFailed} methods, which will callback to your here given {@code onOK} or {@code onFailed} arguments.
   * <p>
   *
   * @param client The client which holds the notifications listeners
   * @param request The incoming request that contains a notification
   * @param responder The responder that will be used to actually send something back as a response
   *
   * @throws IOException If the JSON string could not be deserialized or the response could not be sent.
   * @throws TrustlyNoNotificationListenerException If there was no listener for the notification, nor one for unknown ones.
   * @throws TrustlyValidationException If the response data could not be properly validated.
   * @throws TrustlySignatureException If the signature of the response could not be properly verified.
   */
  public static async handleNotificationRequest(client: TrustlyApiClient, request: string | ArrayBuffer, responder: NotificationResponder): Promise<void> {

    let requestStringBody: string;
    if (typeof request == 'string') {
      requestStringBody = request;
    } else {
      throw new Error(`Do not know how to handle a request of type ${typeof request}`);
    }

    let responseCount = 0;

    // try {
    await client.handleNotification(
      requestStringBody,
      (method, uuid, response) => {
        responseCount++;
        return TrustlyApiClientExtensions.respond(client, responder, method, uuid, response, 200);
      },
    );
    // } catch (ex) {
    //
    //   if (client.getSettings().includeExceptionMessageInNotificationResponse) {
    //
    //     const message = ((ex instanceof Error) ? ex.message : JSON.stringify(ex));
    //     return TrustlyApiClientExtensions.respond(client, responder, method, uuid, response, 200);
    //
    //   } else {
    //     throw ex;
    //   }
    //
    //   // if (onResponse) {
    //   //
    //   //   // const response = {
    //   //   //   status: 'FAILED'
    //   //   // } as NotificationResponseDataBase<NotificationAckTypes[M]>;
    //   //
    //   //   return onResponse(args.method, rpcRequest.params.uuid, response, message);
    //   // } else {
    //   // return Promise.reject(new Error(message));
    //   // }
    // }

    if (responseCount === 0) {
      throw new TrustlyNoNotificationClientException(
        'None of your client\'s event listeners responded with OK or FAILED. That must be done.');
    }
  }

  public static respond<M extends string>(
    client: TrustlyApiClient,
    responder: NotificationResponder,
    method: M,
    uuid: string,
    notificationResponse: NotificationAckTypes[M],
    httpStatusCode: number,
  ): Promise<void> {

    const rpcResponse = client.createResponsePackage(method, uuid, notificationResponse);

    const rpcString = JSON.stringify(rpcResponse);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const assemblyVersion: string = process?.env?.npm_package_version ?? 'N/A';

    responder.addHeader('Content-Type', 'application/json');
    responder.addHeader('Accept', 'application/json');
    responder.addHeader('User-Agent', 'trustly-api-client-js/' + assemblyVersion);
    responder.setStatus(httpStatusCode);
    return responder.writeBody(rpcString);
  }
}



