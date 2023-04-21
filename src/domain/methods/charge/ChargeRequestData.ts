import {ChargeRequestDataAttributes} from './ChargeRequestDataAttributes';
import {AbstractToTrustlyRequestData} from '../../base/AbstractToTrustlyRequestData';

export interface ChargeRequestData extends AbstractToTrustlyRequestData<ChargeRequestDataAttributes> {

  /**
   * The AccountID received from an account notification which shall be charged.
   */
  accountId?: string;

  /**
   * The URL to which notifications for this payment should be sent to.This URL should be hard to guess and not contain a? ("question
   * mark").
   */
  notificationURL?: string;

  /**
   * ID, username, hash or anything uniquely identifying the end-user being charged.
   * <p>
   * Preferably the same ID/username as used in the merchant's own backoffice in order to simplify for the merchant's support department.
   */
  endUserId?: string;

  /**
   * Your unique ID for the charge.
   */
  messageId?: string;

  /**
   * The amount to charge with exactly two decimals.Only digits. Use dot (.) as decimal separator.
   */
  amount?: string;

  /**
   * The currency of the amount to charge.
   */
  currency?: string;
}
