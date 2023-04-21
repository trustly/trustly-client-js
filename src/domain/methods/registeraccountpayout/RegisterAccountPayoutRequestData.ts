import {RegisterAccountPayoutRequestDataAttributes} from './RegisterAccountPayoutRequestDataAttributes';
import {AbstractToTrustlyRequestData} from '../../base/AbstractToTrustlyRequestData';

export interface RegisterAccountPayoutRequestData extends AbstractToTrustlyRequestData<RegisterAccountPayoutRequestDataAttributes> {

  /**
   * ID, username, hash or anything uniquely identifying the end-user to be identified. Preferably the same ID/username as used in the
   * merchant's own backoffice in order to simplify for the merchant's support department
   */
  endUserId?: string;

  /**
   * The clearing house of the end-user's bank account. Typically the name of a country in uppercase letters.
   * <p>
   * See table <a href="https://developers.trustly.com/emea/docs/registeraccount">here</a>.
   *
   * <pre>{@code SWEDEN}</pre>
   */
  clearingHouse?: string;

  /**
   * The bank number identifying the end-user's bank in the given clearing house. For bank accounts in IBAN format you should just provide
   * an empty string (""). For non-IBAN format, see table <a href="https://developers.trustly.com/emea/docs/registeraccount">here</a>
   */
  bankNumber?: string;

  /**
   * The account number, identifying the end-user's account in the bank. Can be either IBAN or country-specific format, see table
   * <a href="https://developers.trustly.com/emea/docs/registeraccount">here</a>
   */
  accountNumber?: string;

  /**
   * First name of the account holder (or the name of the company/organization)
   */
  firstname?: string;

  /**
   * Last name of the account holder (empty for organizations/companies)
   */
  lastname?: string;

  /**
   * The URL to which notifications for this payment should be sent to. This URL should be hard to guess and not contain a ? ("question
   * mark").
   */
  notificationUrl?: string;

  /**
   * Your unique ID for the payout. If the MessageID is a previously initiated P2P order then the payout will be attached to that P2P order
   * and the amount must be equal to or lower than the previously deposited amount.
   */
  messageId?: string;

  /**
   * The amount to send with exactly two decimals. Only digits. Use dot (.) as decimal separator. If the end-user holds a balance in the
   * merchant's system then the amount must have been deducted from that balance before calling this method.
   */
  amount?: string;

  /**
   * The currency of the end-user's account in the merchant's system.
   */
  currency?: string;
}

