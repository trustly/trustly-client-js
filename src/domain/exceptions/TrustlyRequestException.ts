/**
 * Wrapping exception for general error situations. Check the actual exception using {@link Exception#getCause()}.
 */
export class TrustlyRequestException extends Error {

  public readonly cause?: Error;

  public constructor(cause?: Error) {
    super(cause?.message, {cause: cause});
    if (cause) {
      this.cause = cause;
    }
  }
}
