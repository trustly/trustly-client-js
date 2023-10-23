import {StringBoolean} from "./StringBoolean";

export interface IWithRejectionResult {

  // isResult(): boolean;

  // getRejected(): string;

  /**
   * {@code "1"} if the Charge could be canceled, and {@code "0"} otherwise.
   */
  result: StringBoolean;

  /**
   * If the CancelCharge was NOT accepted and result 0 is sent, a textual code describing the rejection reason will be sent here.
   * <p>
   * For a successful CancelCharge, this will be {@code null}.
   */
  rejected?: string;
}
