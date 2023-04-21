import {AbstractResponseResultData} from '../../base/AbstractResponseResultData';

export interface WithdrawResponseData extends AbstractResponseResultData {

  /**
   * The globally unique OrderID the withdrawal was assigned in our system.
   */
  orderId: number;

  /**
   * The URL that should be loaded so that the end-user can complete the withdrawal.
   */
  url: string;
}
