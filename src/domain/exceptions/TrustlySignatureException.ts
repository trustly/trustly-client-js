import {AbstractTrustlyApiException} from './AbstractTrustlyApiException';

export class TrustlySignatureException extends AbstractTrustlyApiException {

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
