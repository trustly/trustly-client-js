import {AbstractFromTrustlyRequestData} from '../base/AbstractFromTrustlyRequestData';
import {EmptyRequestDataAttributes} from '../base/EmptyRequestDataAttributes';

export interface CancelNotificationData extends AbstractFromTrustlyRequestData<EmptyRequestDataAttributes> {

  messageId?: string;

  orderId?: string;

  notificationId?: string;

  endUserId?: string;

  timestamp?: string;
}
