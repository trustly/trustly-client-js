import {AbstractTrustlyApiException} from './AbstractTrustlyApiException';

export  class TrustlyNoNotificationClientException extends AbstractTrustlyApiException {

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
