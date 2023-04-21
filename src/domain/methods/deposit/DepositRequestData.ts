import {DepositRequestDataAttributes} from './DepositRequestDataAttributes';
import {AbstractToTrustlyRequestData} from '../../base/AbstractToTrustlyRequestData';


export interface DepositRequestData extends AbstractToTrustlyRequestData<DepositRequestDataAttributes> {

  notificationUrl?: string;

  endUserId?: string;

  messageId?: string;

  // public getAttributes():  DepositRequestDataAttributes | null {
  //   return super.getAttributes();
  // }
}
