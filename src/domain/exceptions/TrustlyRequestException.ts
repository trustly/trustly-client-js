
import { java } from "jree";




/**
 * Wrapping exception for general error situations. Check the actual exception using {@link Exception#getCause()}.
 */
export  class TrustlyRequestException extends java.lang.Exception {

  public constructor(cause: java.lang.Throwable| null) {
    super(cause);
  }
}
