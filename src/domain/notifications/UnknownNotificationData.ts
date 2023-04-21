import {AbstractFromTrustlyRequestData} from '../base/AbstractFromTrustlyRequestData';
import {EmptyRequestDataAttributes} from '../base/EmptyRequestDataAttributes';

export interface UnknownNotificationData extends AbstractFromTrustlyRequestData<EmptyRequestDataAttributes> {

  [x: string]: unknown;
}
