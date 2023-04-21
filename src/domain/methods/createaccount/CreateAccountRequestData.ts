import {AbstractToTrustlyRequestData} from '../../base/AbstractToTrustlyRequestData';
import {CreateAccountRequestDataAttributes} from './CreateAccountRequestDataAttributes';

export  interface CreateAccountRequestData extends AbstractToTrustlyRequestData<CreateAccountRequestDataAttributes> {

  /**
   * ID, username, hash or anything uniquely identifying the end-user holding this account.
   * <p>
   * Preferably the same ID/username as used in the merchant's own backoffice in order to simplify for the merchant's support department.
   */
  endUserId?: string;

  /**
   * The clearing house of the end-user's bank account. Typically the name of a country in uppercase letters. See table* below.
   */
  clearingHouse?: string;

  /**
   * The bank number identifying the end-user's bank in the given clearing house. For bank accounts in IBAN format you should just provide
   * an empty string (""). For non-IBAN format, see table* below.
   */
  bankNumber?: string;

  /**
   * The account number, identifying the end-user's account in the bank. Can be either IBAN or country-specific format, see table* below.
   */
  accountNumber?: string;
  /**
   * First name of the account holder (or the name of the company/organization)
   */
  firstname?: string;

  /**
   * Last name of the account holder(empty for organizations/companies)
   */
  lastname?: string;
}

