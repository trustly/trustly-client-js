import {TrustlyNoNotificationClientException} from '../domain/exceptions/TrustlyNoNotificationClientException';
import {TrustlyApiClient} from './TrustlyApiClient';
import {NotificationResponse} from '../domain/base/NotificationResponse';
import {JsonRpcResponse} from '../domain/base/JsonRpcResponse';
import {TrustlyStringUtils} from '../util/TrustlyStringUtils';
import * as pack from '../../package.json';
import * as http from 'http';

export interface NotificationResponder {

  addHeader(key: string, value: string): void;

  setStatus(httpStatus: number): void;

  writeBody(value: string): void;
}

export class DefaultNotificationResponder implements NotificationResponder {

  private readonly response: http.IncomingMessage;

  public constructor(response: http.IncomingMessage) {
    this.response = response;
  }

  public addHeader(key: string, value: string): void {
    this.response.headers[key] = value;
  }

  public setStatus(httpStatus: number): void {
    this.response.statusCode = httpStatus;
  }

  public writeBody(_value: string): void {
    throw new Error(`Not implemented writing body`);
  }
}

export class TrustlyApiClientExtensions {

  public static handleNotificationToHttp(request: string | ArrayBuffer, response: http.IncomingMessage): void {
    TrustlyApiClientExtensions.handleNotificationRequest(request, new DefaultNotificationResponder(response));
  }

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
   * @param request The incoming request that contains a notification
   * @param response The outgoing response that we should send our notification response to
   * @param responder The responder that will be used to actually send something back as a response
   *
   * @throws IOException If the JSON string could not be deserialized or the response could not be sent.
   * @throws TrustlyNoNotificationListenerException If there was no listener for the notification, nor one for unknown ones.
   * @throws TrustlyValidationException If the response data could not be properly validated.
   * @throws TrustlySignatureException If the signature of the response could not be properly verified.
   */
  public static handleNotificationRequest(request: string | ArrayBuffer, responder: NotificationResponder): void {

    // TrustlyApiClientExtensions.handleNotificationRequest(request.getInputStream(), new DefaultNotificationResponder(response));
    // TrustlyApiClientExtensions.handleNotificationRequest(incoming, new DefaultNotificationResponder(response));

    // const [incoming, responder] = args as [java.io.InputStream, TrustlyApiClientExtensions.NotificationResponder];

    let requestStringBody: string;
    if (typeof request == 'string') {
      requestStringBody = request;
    } else {
      throw new Error(`Do not know how to handle this yet`);
    }

    let responseCount = 0;
    let clientCount = 0;
    for (const client of TrustlyApiClient.getRegisteredClients()) {
      clientCount++;
      client.handleNotification(
        requestStringBody,
        (method, uuid) => {
          responseCount++;
          TrustlyApiClientExtensions.respond(client, responder, method, uuid, 'OK', undefined, 200);
        },
        (method, uuid, message) => {
          responseCount++;
          TrustlyApiClientExtensions.respond(client, responder, method, uuid, 'FAILED', message, 500);
        },
      );
    }

    if (clientCount === 0) {
      throw new TrustlyNoNotificationClientException('There are no registered Api Clients listening to notifications');
    }

    if (responseCount === 0) {
      throw new TrustlyNoNotificationClientException(
        'None of your client\'s event listeners responded with OK or FAILED. That must be done.');
    }
  }

  // public static handleNotificationRequest(incoming: java.io.InputStream| null, response: HttpServletResponse| null):  void;

  // public static handleNotificationRequest(incoming: java.io.InputStream| null, responder: TrustlyApiClientExtensions.NotificationResponder| null):  void;

  public static respond(
    client: TrustlyApiClient,
    responder: NotificationResponder,
    method: string,
    uuid: string,
    status: 'OK' | 'FAILED',
    message: string | undefined,
    httpStatusCode: number,
  ): void {

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

      // rpcResponse = rpcResponse.toBuilder()
      //   .result(
      //     rpcResponse.getResult().toBuilder()
      //       .data(
      //         rpcResponse.getResult().getData().toBuilder()
      //           .any("message", message)
      //           .build()
      //       )
      //       .build()
      //   )
      //   .build();
    }

    // TODO: Needs special conversion for some fields, such as string number booleans?
    const rpcString = JSON.stringify(rpcResponse); // TrustlyApiClientExtensions.OBJECT_MAPPER.writeValueAsString(rpcResponse);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const assemblyVersion: string = process.env.npm_package_version ?? pack?.version ?? 'N/A'; // TrustlyApiClientExtensions.class.getPackage().getImplementationVersion();

    responder.addHeader('Content-Type', 'application/json');
    responder.addHeader('Accept', 'application/json');
    responder.addHeader('User-Agent', 'trustly-api-client-js/' + assemblyVersion);
    responder.setStatus(httpStatusCode);
    responder.writeBody(rpcString);
  }
}



