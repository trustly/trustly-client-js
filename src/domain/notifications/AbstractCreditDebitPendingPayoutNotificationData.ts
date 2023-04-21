import {AbstractFromTrustlyRequestData} from '../base/AbstractFromTrustlyRequestData';
import {EmptyRequestDataAttributes} from '../base/EmptyRequestDataAttributes';

export interface AbstractCreditDebitPendingPayoutNotificationData extends AbstractFromTrustlyRequestData<EmptyRequestDataAttributes> {

  amount?: string;

  currency?: string;

  messageId?: string;

  orderId?: string;

  endUserId?: string;

  notificationId?: string;

  timestamp?: string;
}
