import {AbstractResponseResultData} from '../../base/AbstractResponseResultData';
import {StringBoolean} from "../../base/StringBoolean";

export interface RegisterAccountPayoutResponseData extends AbstractResponseResultData {

  /**
   * The globally unique OrderID the account payout order was assigned in our system .
   */
  orderId: number;

  /**
   * "1" if the payout could be accepted and "0" otherwise .
   */
  result: StringBoolean;
}
