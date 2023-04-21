import {AbstractToTrustlyRequestData} from '../../base/AbstractToTrustlyRequestData';
import {EmptyRequestDataAttributes} from '../../base/EmptyRequestDataAttributes';

export interface DenyWithdrawalRequestData extends AbstractToTrustlyRequestData<EmptyRequestDataAttributes> {

  orderId: number;
}

