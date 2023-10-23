import {AbstractResponseResultData} from '../../base/AbstractResponseResultData';
import {StringBoolean} from "../../base/StringBoolean";

export interface ApproveWithdrawalResponseData extends AbstractResponseResultData {

  /**
   * The OrderID specified when calling the method.
   */
  orderId: number;

  /**
   * 1 if the withdrawal could be approved and 0 otherwise.
   */
  result: StringBoolean;
}
