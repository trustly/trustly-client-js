import {IWithRejectionResult} from '../../base/IWithRejectionResult';
import {AbstractResponseResultData} from '../../base/AbstractResponseResultData';
import {StringBoolean} from "../../base/StringBoolean";

export interface ChargeResponseData extends AbstractResponseResultData, IWithRejectionResult {

  /**
   * The globally unique OrderID the charge order was assigned in our system, or null if the charge was not accepted. The order has no
   * end-user interaction; it is merely used as a reference for the notifications delivered regarding the charge. See section
   * "Notifications" below for details.
   */
  orderId?: string;

  /**
   * 1 if the charge was accepted for processing, 0 otherwise. Note that this is an acceptance of the order, no money has been charged from
   * the account until you receive notifications thereof.
   */
  result: StringBoolean;

  /**
   * If the charge was NOT accepted, a textual code describing the rejection reason, null otherwise.
   * <p>
   * The possible rejected codes are:
   * <p>
   * ERROR_MANDATE_NOT_FOUND - the AccountID does not have an active mandate ERROR_DIRECT_DEBIT_NOT_ALLOWED - Trustly Direct Debit is not
   * enabled on the merchant's account in Trustly's system. ERROR_ACCOUNT_NOT_FOUND - the specified AccountID does not exist.
   */
  rejected?: string;
}
