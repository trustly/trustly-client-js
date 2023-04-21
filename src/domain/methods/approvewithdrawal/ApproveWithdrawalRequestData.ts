import {AbstractToTrustlyRequestData} from '../../base/AbstractToTrustlyRequestData';
import {EmptyRequestDataAttributes} from '../../base/EmptyRequestDataAttributes';

export interface ApproveWithdrawalRequestData extends AbstractToTrustlyRequestData<EmptyRequestDataAttributes> {

  orderId: number;
}

