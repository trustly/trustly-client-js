import {AbstractToTrustlyRequestData} from '../../base/AbstractToTrustlyRequestData';
import {SelectAccountRequestDataAttributes} from './SelectAccountRequestDataAttributes';

export  interface SelectAccountRequestData extends AbstractToTrustlyRequestData<SelectAccountRequestDataAttributes> {

  /**
   * The URL to which notifications for this order should be sent to.This URL should be hard to guess and not contain a? ("question mark").
   *
   * <pre>{@code https://example.com/trustly/notification/a2b63j23dj23883jhfhfh}</pre>
   */
  NotificationURL: string;

  /**
   * ID, username, hash or anything uniquely identifying the end-user to be identified. Preferably the same ID/username as used in the
   * merchant's own backoffice in order to simplify for the merchant's support department
   */
  EndUserID: string;

  /**
   * Your unique ID for the account selection order. Each order you create must have an unique MessageID.
   */
  MessageID: string;
}
