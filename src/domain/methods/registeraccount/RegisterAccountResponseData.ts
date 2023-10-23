import {AbstractResponseResultData} from '../../base/AbstractResponseResultData';

export interface RegisterAccountResponseData extends AbstractResponseResultData {

  /**
   * The globally unique AccountID the account was assigned in our system.
   *
   * <pre>{@code 7653385737}</pre>
   */
  accountid?: string;

  /**
   * The clearinghouse for this account.
   *
   * <pre>{@code SWEDEN}</pre>
   */
  clearinghouse?: string;

  /**
   * The name of the bank for this account.
   *
   * <pre>{@code Skandiabanken}</pre>
   */
  bank?: string;

  /**
   * A descriptor for this account that is safe to show to the end user.
   *
   * <pre>{@code ***4057}</pre>
   */
  descriptor?: string;
}
