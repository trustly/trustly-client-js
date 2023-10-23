import {AbstractRequestParamsDataAttributes} from '../base/AbstractRequestParamsDataAttributes';

export interface AccountNotificationDataAttributes extends AbstractRequestParamsDataAttributes {

  /**
   * The clearinghouse for this account
   */
  clearinghouse?: string;

  /**
   * The bank for this account
   */
  bank?: string;

  /**
   * A text that is safe to show the enduser for identifying the account.Do not parse this text since it will be a different format for different accounts.
   */
  descriptor?: string;

  /**
   * The last digits of the bank account number.This can be used for matching against received KYC data from your manual routines.
   */
  lastdigits?: string;

  /**
   * An ID that uniquely identifies the account holder.Note: The format of this field will for some countries look different than the example.
   */
  personid?: string;

  /**
   * The name of the account holder
   */
  name?: string;

  /**
   * The address of the account holder
   */
  address?: string;

  /**
   * The zipcode of the account holder
   */
  zipcode?: string;

  /**
   * The city of the account holder
   */
  city?: string;

  /**
   * 1 if a direct debit mandate exists for this account, 0 otherwise
   */
  directdebitmandate?: 1 | 0;
}
