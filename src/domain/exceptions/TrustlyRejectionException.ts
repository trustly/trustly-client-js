import {AbstractTrustlyApiException} from './AbstractTrustlyApiException';

export  class TrustlyRejectionException extends AbstractTrustlyApiException {

  private readonly reason?: string;

  public constructor(message: string, reason?: string) {
    super(message);
    if (reason) {
      this.reason = reason;
    }
  }

  public getReason():  string | undefined {
    return this.reason;
  }
}
