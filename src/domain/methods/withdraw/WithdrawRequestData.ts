import {WithdrawRequestDataAttributes} from './WithdrawRequestDataAttributes';
import {AbstractToTrustlyRequestData} from '../../base/AbstractToTrustlyRequestData';

export interface WithdrawRequestData extends AbstractToTrustlyRequestData<WithdrawRequestDataAttributes> {

  /**
   * The URL to which notifications for this payment should be sent to. This URL should be hard to guess and not contain a ? ("question
   * mark").
   */
  NotificationURL: string;

  /**
   * ID, username, hash or anything uniquely identifying the end-user requesting the withdrawal, Preferably the same ID/username as used in
   * the merchant's own backoffice in order to simplify for the merchant's support department.
   */
  EndUserID: string;

  /**
   * Your unique ID for the withdrawal.
   */
  MessageID: string;

  /**
   * The currency of the end-user's account in the merchant's system.
   */
  Currency: string;
}
