import {AbstractTrustlyApiException} from './AbstractTrustlyApiException';

export class TrustlyValidationException extends AbstractTrustlyApiException {

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
