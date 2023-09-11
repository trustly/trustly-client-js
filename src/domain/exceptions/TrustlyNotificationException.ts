import {AbstractTrustlyApiException} from './AbstractTrustlyApiException';

export  class TrustlyNotificationException extends AbstractTrustlyApiException {

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
