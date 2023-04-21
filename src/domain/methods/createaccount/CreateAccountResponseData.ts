import {AbstractResponseResultData} from '../../base/AbstractResponseResultData';

export interface CreateAccountResponseData extends AbstractResponseResultData {

  /**
   * The globally unique AccountID the account was assigned in our system.
   */
  accountId?: string;

  /**
   * The clearinghouse for this account.
   */
  clearingHouse?: string;

  /**
   * The name of the bank for this account.
   */
  bank?: string;

  /**
   * A descriptor for this account that is safe to show to the end user.
   */
  descriptor?: string;
}
