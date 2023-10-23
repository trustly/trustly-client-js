import {AbstractResponseResultData} from "../../base/AbstractResponseResultData";
import {StringBoolean} from "../../base/StringBoolean";

export interface MerchantSettlementResponseData extends AbstractResponseResultData {

  /**
   * The globally unique OrderID the account payout order was assigned in our system .
   */
  orderid: number;

  /**
   * "1" if the payout could be accepted and "0" otherwise .
   */
  result: StringBoolean;
}
