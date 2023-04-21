import {AbstractRequestParamsDataAttributes} from './AbstractRequestParamsDataAttributes';
import {AbstractFromTrustlyRequestData} from './AbstractFromTrustlyRequestData';

export interface AbstractNotificationRequestData<A extends AbstractRequestParamsDataAttributes> extends AbstractFromTrustlyRequestData<A> {

  messageId: string;
  notificationId: string;
  orderId: string;
}
