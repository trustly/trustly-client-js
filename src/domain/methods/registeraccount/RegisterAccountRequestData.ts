import {AbstractToTrustlyRequestData} from '../../base/AbstractToTrustlyRequestData';
import {RegisterAccountRequestDataAttributes} from './RegisterAccountRequestDataAttributes';

export interface RegisterAccountRequestData extends AbstractToTrustlyRequestData<RegisterAccountRequestDataAttributes> {

  /**
   * ID, username, hash or anything uniquely identifying the end-user to be identified. Preferably the same ID/username as used in the
   * merchant's own backoffice in order to simplify for the merchant's support department
   */
  EndUserId: string;

  /**
   * The clearing house of the end-user's bank account. Typically the name of a country in uppercase letters. See table
   * <a href="https://developers.trustly.com/emea/docs/registeraccount">here</a>
   * <pre>{@code SWEDEN}</pre>
   */
  ClearingHouse: string;

  /**
   * The bank number identifying the end-user's bank in the given clearing house. For bank accounts in IBAN format you should just provide
   * an empty string (""). For non-IBAN format, see table <a href="https://developers.trustly.com/emea/docs/registeraccount">here</a>
   */
  BankNumber: string;

  /**
   * The account number, identifying the end-user's account in the bank. Can be either IBAN or country-specific format, see table
   * <a href="https://developers.trustly.com/emea/docs/registeraccount">here</a>
   */
  AccountNumber: string;

  /**
   * First name of the account holder (or the name of the company/organization)
   */
  Firstname: string;

  /**
   * Last name of the account holder (empty for organizations/companies)
   */
  Lastname: string;
}

