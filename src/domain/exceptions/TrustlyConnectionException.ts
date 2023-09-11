import {AbstractTrustlyApiException} from './AbstractTrustlyApiException';

export class TrustlyConnectionException extends AbstractTrustlyApiException {

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
