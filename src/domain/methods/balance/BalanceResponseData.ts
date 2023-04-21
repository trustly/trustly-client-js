import {IResponseResultData} from '../../base/IResponseResultData';
import {BalanceResponseDataEntry} from './BalanceResponseDataEntry';

export interface BalanceResponseData extends IResponseResultData {

  entries: BalanceResponseDataEntry[];
}
