import {IResponseResultData} from '../../base/IResponseResultData';
import {GetWithdrawalsResponseDataEntry} from './GetWithdrawalsResponseDataEntry';

export interface GetWithdrawalsResponseData extends IResponseResultData {

  entries: GetWithdrawalsResponseDataEntry[];
}
