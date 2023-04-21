import {AbstractResponseResultData} from '../../base/AbstractResponseResultData';

export interface RefundResponseData extends AbstractResponseResultData {

  /**
   * The OrderID specified when calling the method.
   */
  orderId: number;

  /**
   * "1" if the refund request is accepted by Trustly's system.
   * <p>
   * If the refund request is not accepted, you will get an error code back in {@link JsonRpcResponse#getError()}.
   */
  result: boolean;
}
