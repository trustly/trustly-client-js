import {AccountNotificationDataAttributes} from './AccountNotificationDataAttributes';
import {AbstractFromTrustlyRequestData} from '../base/AbstractFromTrustlyRequestData';

export  interface AccountNotificationData extends AbstractFromTrustlyRequestData<AccountNotificationDataAttributes> {

  messageId?: string;

  orderId?: string;

  notificationId?: string;

  accountId?: string;

  verified: boolean;
}
