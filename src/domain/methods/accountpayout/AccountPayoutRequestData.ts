import {AccountPayoutRequestDataAttributes} from './AccountPayoutRequestDataAttributes';
import {AbstractToTrustlyRequestData} from '../../base/AbstractToTrustlyRequestData';

export interface AccountPayoutRequestData extends AbstractToTrustlyRequestData<AccountPayoutRequestDataAttributes> {

  /**
   * The URL to which notifications for this payment should be sent to. This URL should be hard to guess and not contain a ? ("question
   * mark").
   */
  NotificationURL: string;

  /**
   * The AccountID received from an account notification to which the money shall be sent.
   */
  AccountID: string;

  /**
   * ID, username, hash or anything uniquely identifying the end-user requesting the withdrawal, Preferably the same ID/username as used in
   * the merchant's own backoffice in order to simplify for the merchant's support department.
   */
  EndUserID: string;

  /**
   * Your unique ID for the payout. If the MessageID is a previously initiated P2P order then the payout will be attached to that P2P order
   * and the amount must be equal to or lower than the previously deposited amount.
   */
  MessageID: string;

  /**
   * The amount to send with exactly two decimals. Only digits. Use dot (.) as decimal separator. If the end-user holds a balance in the
   * merchant's system then the amount must have been deducted from that balance before calling this method.
   */
  Amount: string;

  /**
   * The currency of the end-user's account in the merchant's system.
   */
  Currency: string;
}

