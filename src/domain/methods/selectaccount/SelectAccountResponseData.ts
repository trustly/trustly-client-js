import {AbstractResponseResultData} from '../../base/AbstractResponseResultData';

export interface SelectAccountResponseData extends AbstractResponseResultData {

  /**
   * The globally unique OrderID the account selection order was assigned in our system.
   *
   * <pre>{@code 7653345737}</pre>
   */
  orderId?: string;

  /**
   * The URL that should be loaded so that the end-user can complete the identification process.
   *
   * <pre>{@code https://trustly.com/_/2f6b14fa-446a-4364-92f8-84b738d589ff}</pre>
   */
  url?: string;
}
