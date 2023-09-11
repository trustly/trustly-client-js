import {AbstractTrustlyApiException} from './AbstractTrustlyApiException';
import {ResponseError} from '../base/ResponseError';

export class TrustlyErrorResponseException extends AbstractTrustlyApiException {

  private readonly responseError?: ResponseError;

  public constructor(message: string, cause: Error | undefined, responseError?: ResponseError) {
    super(`${message} - ${responseError?.message ?? responseError?.name ?? ''}`, cause);
    if (responseError) {
      this.responseError = responseError;
    }
  }

  public getResponseError(): ResponseError | undefined {
    return this.responseError;
  }
}
