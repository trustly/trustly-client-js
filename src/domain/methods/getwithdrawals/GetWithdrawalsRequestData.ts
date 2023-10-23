import {EmptyRequestDataAttributes} from '../../base/EmptyRequestDataAttributes';
import {AbstractToTrustlyRequestData} from '../../base/AbstractToTrustlyRequestData';

export interface GetWithdrawalsRequestData extends AbstractToTrustlyRequestData<EmptyRequestDataAttributes> {

  OrderID: string;
}

