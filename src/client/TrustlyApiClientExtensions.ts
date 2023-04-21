


import { java, JavaObject, int, closeResources, handleResourceError, throwResourceError, S } from "jree";




export  class TrustlyApiClientExtensions extends JavaObject {

  public static

   interface NotificationResponder {

     addHeader(key: string| null, value: string| null): void;

     setStatus(httpStatus: int): void;

     writeBody(value: string| null): void;
  }

  public static DefaultNotificationResponder =  class DefaultNotificationResponder extends JavaObject implements DefaultNotificationResponder.NotificationResponder {

    private readonly response:  HttpServletResponse | null;

    public constructor(response: HttpServletResponse| null) {
      super();
this.response = response;
    }

    public addHeader(key: string| null, value: string| null):  void {
      this.response.addHeader(key, value);
    }

    public setStatus(httpStatus: int):  void {
      this.response.setStatus(httpStatus);
    }

    public writeBody(value: string| null):  void {
      this.response.getWriter().write(value);
    }
  };


  private static readonly OBJECT_MAPPER:  ObjectMapper | null = new  ObjectMapper();

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
   *
   * @throws IOException If the JSON string could not be deserialized or the response could not be sent.
   * @throws TrustlyNoNotificationListenerException If there was no listener for the notification, nor one for unknown ones.
   * @throws TrustlyValidationException If the response data could not be properly validated.
   * @throws TrustlySignatureException If the signature of the response could not be properly verified.
   */
  public static handleNotificationRequest(request: HttpServletRequest| null, response: HttpServletResponse| null):  void;

  public static handleNotificationRequest(incoming: java.io.InputStream| null, response: HttpServletResponse| null):  void;

  public static handleNotificationRequest(incoming: java.io.InputStream| null, responder: TrustlyApiClientExtensions.NotificationResponder| null):  void;
public static handleNotificationRequest(...args: unknown[]):  void {
		switch (args.length) {
			case 2: {
				const [request, response] = args as [HttpServletRequest, HttpServletResponse];



    TrustlyApiClientExtensions.handleNotificationRequest(request.getInputStream(), new  TrustlyApiClientExtensions.DefaultNotificationResponder(response));
  

				break;
			}

			case 2: {
				const [incoming, response] = args as [java.io.InputStream, HttpServletResponse];



    TrustlyApiClientExtensions.handleNotificationRequest(incoming, new  TrustlyApiClientExtensions.DefaultNotificationResponder(response));
  

				break;
			}

			case 2: {
				const [incoming, responder] = args as [java.io.InputStream, TrustlyApiClientExtensions.NotificationResponder];



    let  requestStringBody: string;
     {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const sr: java.io.InputStreamReader  = new  java.io.InputStreamReader(incoming)
try {
	try  {
      requestStringBody = TrustlyStreamUtils.readerToString(sr);
    }
	finally {
	error = closeResources([sr]);
	}
} catch(e) {
	error = handleResourceError(e, error);
} finally {
	throwResourceError(error);
}
}


     let  responseCount: java.util.concurrent.atomic.AtomicInteger = new  java.util.concurrent.atomic.AtomicInteger(0);
     let  clientCount: java.util.concurrent.atomic.AtomicInteger = new  java.util.concurrent.atomic.AtomicInteger(0);
    for (let client of TrustlyApiClient.getRegisteredClients()) {
      clientCount.incrementAndGet();
      client.handleNotification(
        requestStringBody,
        (method, uuid) => {
          responseCount.incrementAndGet();
          TrustlyApiClientExtensions.respond(client, responder, java.net.http.HttpRequest.method, uuid, "OK", null, 200);
        },
        (method, uuid, message) => {
          responseCount.incrementAndGet();
          TrustlyApiClientExtensions.respond(client, responder, java.net.http.HttpRequest.method, uuid, "FAILED", message, 500);
        }
      );
    }

    if (clientCount.get() === 0) {
      throw new  TrustlyNoNotificationClientException("There are no registered Api Clients listening to notifications");
    }

    if (responseCount.get() === 0) {
      throw new  TrustlyNoNotificationClientException(
        "None of your client's event listeners responded with OK or FAILED. That must be done.");
    }
  

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


  public static respond(
    client: TrustlyApiClient| null,
    responder: TrustlyApiClientExtensions.NotificationResponder| null,
    method: string| null,
    uuid: string| null,
    status: string| null,
    message: string| null,
    httpStatusCode: int
  ):  void {

    let  notificationResponse: NotificationResponse = NotificationResponse.builder()
      .status(status)
      .build();

    let  rpcResponse: JsonRpcResponse<NotificationResponse> = client.createResponsePackage(method, uuid, notificationResponse);

    if (client.getSettings().isIncludeMessageInNotificationResponse() && !TrustlyStringUtils.isBlank(message)) {

      rpcResponse = rpcResponse.toBuilder()
        .result(
          rpcResponse.getResult().toBuilder()
            .data(
              rpcResponse.getResult().getData().toBuilder()
                .any("message", message)
                .build()
            )
            .build()
        )
        .build();
    }

    let  rpcString: string = TrustlyApiClientExtensions.OBJECT_MAPPER.writeValueAsString(rpcResponse);

    let  assemblyVersion: string = TrustlyApiClientExtensions.class.getPackage().getImplementationVersion();

    responder.addHeader("Content-Type", "application/json");
    responder.addHeader("Accept", "application/json");
    responder.addHeader("User-Agent", "trustly-api-client-java/" + assemblyVersion);
    responder.setStatus(httpStatusCode);
    responder.writeBody(rpcString);
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace TrustlyApiClientExtensions {
	export type DefaultNotificationResponder = InstanceType<typeof TrustlyApiClientExtensions.DefaultNotificationResponder>;
}


