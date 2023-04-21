import {AbstractToTrustlyRequestData} from '../../base/AbstractToTrustlyRequestData';
import {EmptyRequestDataAttributes} from '../../base/EmptyRequestDataAttributes';

export interface AccountLedgerRequestData extends AbstractToTrustlyRequestData<EmptyRequestDataAttributes> {

  fromDate: string;
  toDate: string;
  currency: string;

  // constructor(fromDate: string, toDate: string, currency: string) {
  //   super();
  //   this.fromDate = fromDate;
  //   this.toDate = toDate;
  //   this.currency = currency;
  // }
}

    

