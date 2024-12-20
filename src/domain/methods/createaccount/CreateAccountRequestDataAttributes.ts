import {AbstractRequestParamsDataAttributes} from '../../base/AbstractRequestParamsDataAttributes';

export interface CreateAccountRequestDataAttributes extends AbstractRequestParamsDataAttributes {

  /**
   * The date of birth of the account holder(ISO 8601).
   */
  DateOfBirth?: string;

  /**
   * The mobile phonenumber to the account holder in international format.This is used for KYC and AML routines.
   */
  MobilePhone?: string;

  /**
   * The account holder's social security number / personal number / birth number / etc. Useful for some banks for identifying transactions
   * and KYC/AML.
   */
  NationalIdentificationNumber?: string;

  /**
   * The ISO 3166-1-alpha-2 code of the account holder's country.
   */
  AddressCountry?: string;

  /**
   * Postal code of the account holder.
   */
  AddressPostalCode?: string;

  /**
   * City of the account holder.
   */
  AddressCity?: string;

  /**
   * Street address of the account holder.
   */
  AddressLine1?: string;

  /**
   * Additional address information of the account holder.
   */
  AddressLine2?: string;

  /**
   * The entire address of the account holder. This attribute should only be used if you are unable to provide the address information in
   * the 5 separate attributes:
   *
   * <ul>
   *   <li>AddressCountry</li>
   *   <li>AddressPostalCode</li>
   *   <li>AddressCity</li>
   *   <li>AddressLine1</li>
   *   <li>AddressLine2</li>
   * </ul>
   */
  Address?: string;

  /**
   * The email address of the account holder.
   */
  Email?: string;
}
