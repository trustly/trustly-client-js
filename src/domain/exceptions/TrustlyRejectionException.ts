
import { java } from "jree";




export  class TrustlyRejectionException extends AbstractTrustlyApiException {

  private readonly reason?: string;

  public constructor(message: string| null, reason: string| null) {
    super(message);
    this.reason = reason;
  }

  public getReason():  string | null {
    return this.reason;
  }
}
