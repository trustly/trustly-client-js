import {IResponseResultData} from '../../base/IResponseResultData';
import {AccountLedgerResponseDataEntry} from './AccountLedgerResponseDataEntry';

export interface AccountLedgerResponseData extends IResponseResultData {

  entries: AccountLedgerResponseDataEntry[];

//   public constructor(entries: java.util.List<AccountLedgerResponseDataEntry>| null) {
//     super();
// this.entries = entries;
//   }

  // public getAny():  java.util.Map<string, java.lang.Object> | null {
  //   return java.util.Collections.emptyMap();
  // }
}
