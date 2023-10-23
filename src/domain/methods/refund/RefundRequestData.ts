import {AbstractToTrustlyRequestData} from '../../base/AbstractToTrustlyRequestData';
import {RefundRequestDataAttributes} from './RefundRequestDataAttributes';

export interface RefundRequestData extends AbstractToTrustlyRequestData<RefundRequestDataAttributes> {

  /**
   * The OrderID of the initial deposit.
   */
  OrderID: string;

  /**
   * The amount to refund the customer with exactly two decimals. Only digits. Use dot (.) as decimal separator.
   */
  Amount: string;

  /**
   * The currency of the amount to refund the customer.
   */
  Currency: string;
}

