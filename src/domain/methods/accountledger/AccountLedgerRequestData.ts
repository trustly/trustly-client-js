import {AbstractToTrustlyRequestData} from '../../base/AbstractToTrustlyRequestData';
import {EmptyRequestDataAttributes} from '../../base/EmptyRequestDataAttributes';

export interface AccountLedgerRequestData extends AbstractToTrustlyRequestData<EmptyRequestDataAttributes> {

  FromDate: string;
  ToDate: string;
  Currency: string;
}
