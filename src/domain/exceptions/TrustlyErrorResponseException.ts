import {AbstractTrustlyApiException} from './AbstractTrustlyApiException';
import {JsonRpcError} from "../models";

export class TrustlyErrorResponseException extends AbstractTrustlyApiException {

  readonly responseError?: JsonRpcError;

  public constructor(message: string, cause: Error | undefined, responseError?: JsonRpcError) {
    super(`${message} - ${responseError?.message ?? responseError?.name ?? ''}`, cause);
    if (responseError) {
      this.responseError = responseError;
    }
  }
}
