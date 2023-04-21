


import { java } from "jree";




export  class TrustlyErrorResponseException extends AbstractTrustlyApiException {

  private readonly responseError:  ResponseError | null;

  public constructor(message: string| null, cause: java.lang.Exception| null, responseError: ResponseError| null) {
    super(message + " - " + responseError, cause);
    this.responseError = responseError;
  }

  public getResponseError():  ResponseError | null {
    return this.responseError;
  }
}
