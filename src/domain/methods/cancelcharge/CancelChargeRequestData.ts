import {EmptyRequestDataAttributes} from '../../base/EmptyRequestDataAttributes';
import {AbstractToTrustlyRequestData} from '../../base/AbstractToTrustlyRequestData';


export interface CancelChargeRequestData extends AbstractToTrustlyRequestData<EmptyRequestDataAttributes> {

  /**
   * The OrderID of the Charge request that should be canceled.
   */
  orderId?: string;
}


