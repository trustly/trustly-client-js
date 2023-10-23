import {AbstractResponseResultData} from '../../base/AbstractResponseResultData';
import {StringBoolean} from "../../base/StringBoolean";

export interface DenyWithdrawalResponseData extends AbstractResponseResultData {

  /**
   * The OrderID specified when calling the method.
   */
  orderId: number;

  /**
   * "1" if the refund request is accepted by Trustly's system. If the refund request is not accepted, you will get an error code back in
   * the {@link JsonRpcResponse#getError()}
   */
  result: StringBoolean;
}
