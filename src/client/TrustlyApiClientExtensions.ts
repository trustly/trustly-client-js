import {TrustlyNoNotificationClientException} from '../domain/exceptions/TrustlyNoNotificationClientException';
import {TrustlyApiClient} from './TrustlyApiClient';
import {NotificationResponse} from '../domain/base/NotificationResponse';
import {JsonRpcResponse} from '../domain/base/JsonRpcResponse';
import {TrustlyStringUtils} from '../util/TrustlyStringUtils';

export interface NotificationResponder {

  addHeader(key: string, value: string): void;

  setStatus(httpStatus: number): void;

  writeBody(value: string): Promise<void>;
}

export class TrustlyApiClientExtensions {

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

    await client.handleNotification(
      requestStringBody,
      (method, uuid) => {
        responseCount++;
        return TrustlyApiClientExtensions.respond(client, responder, method, uuid, 'OK', undefined, 200);
      },
      (method, uuid, message) => {
        responseCount++;
        return TrustlyApiClientExtensions.respond(client, responder, method, uuid, 'FAILED', message, 500);
      },
    );

    if (responseCount === 0) {
      throw new TrustlyNoNotificationClientException(
        'None of your client\'s event listeners responded with OK or FAILED. That must be done.');
    }
  }

  public static respond(
    client: TrustlyApiClient,
    responder: NotificationResponder,
    method: string,
    uuid: string,
    status: 'OK' | 'FAILED',
    message: string | undefined,
    httpStatusCode: number,
  ): Promise<void> {

    const notificationResponse: NotificationResponse = {
      status: status,
    };

    let rpcResponse: JsonRpcResponse<NotificationResponse> = client.createResponsePackage(method, uuid, notificationResponse);

    if (client.getSettings().includeMessageInNotificationResponse && !TrustlyStringUtils.isBlank(message)) {

      if (rpcResponse.result) {
        rpcResponse = {
          ...rpcResponse,
          result: {
            ...rpcResponse.result,
            data: {
              ...rpcResponse.result.data,
              message: message,
            },
          },
        };
      } else {
        rpcResponse = {
          ...rpcResponse,
          error: {
            ...rpcResponse.error,
          },
        };
      }
    }

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



