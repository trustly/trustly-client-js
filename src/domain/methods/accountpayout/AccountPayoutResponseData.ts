import {AbstractResponseResultData} from '../../base/AbstractResponseResultData';

export interface AccountPayoutResponseData extends AbstractResponseResultData {

  /**
   * The globally unique OrderID the account payout order was assigned in our system.
   */
  orderId: number; // long

  /**
   * "1" if the payout could be accepted and "0" otherwise.
   */
  result: boolean;
}
