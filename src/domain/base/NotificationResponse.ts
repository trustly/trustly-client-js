import {AbstractResponseResultData} from './AbstractResponseResultData';

export interface NotificationResponse extends AbstractResponseResultData {

  /**
   * Valid values are:
   *
   * <ul>
   *   <li>OK - The notification has been received</li>
   * </ul>
   */
  status?: string | undefined;
}
