export abstract class AbstractTrustlyApiException extends Error {

  public readonly cause?: Error;

  constructor(message: string, cause?: Error) {
    super(message);
    if (cause) {
      this.cause = cause;
    }
  }
}
