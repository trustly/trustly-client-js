import {AbstractResponseResultData} from '../../base/AbstractResponseResultData';

export interface DepositResponseData extends AbstractResponseResultData {

  /**
   * The OrderID specified when calling the method.
   */
  orderId?: string;

  /**
   * The URL that should be loaded so that the end-user can complete the deposit.
   */
  url?: string;
}
