import {AbstractRequestParamsDataAttributes} from '../../base/AbstractRequestParamsDataAttributes';

export interface RegisterAccountRequestDataAttributes extends AbstractRequestParamsDataAttributes {

  /**
   * The end-user's date of birth.
   *
   * <pre>{@code 1979-01-31}</pre>
   */
  dateOfBirth?: string;

  /**
   * The mobile phonenumber to the account holder in international format. This is used for KYC and AML routines.
   *
   * <pre>{@code +46709876543}</pre>
   */
  mobilePhone?: string;

  /**
   * The account holder's social security number / personal number / birth number / etc. Useful for some banks for identifying transactions
   * and KYC/AML.
   *
   * <pre>{@code 790131-1234}</pre>
   */
  nationalIdentificationNumber?: string;

  /**
   * The ISO 3166-1-alpha-2 code of the account holder's country.
   *
   * <pre>{@code SE}</pre>
   */
  addressCountry?: string;

  /**
   * Postal code of the account holder.
   *
   * <pre>{@code SE-11253}</pre>
   */
  addressPostalCode?: string;

  /**
   * City of the account holder.
   *
   * <pre>{@code Stockholm}</pre>
   */
  addressCity?: string;

  /**
   * Street address of the account holder.
   *
   * <pre>{@code  Main street 1}</pre>
   */
  addressLine1?: string;

  /**
   * Additional address information of the account holder.
   *
   * <pre>{@code Apartment 123, 2 stairs up}</pre>
   */
  addressLine2?: string;

  /**
   * The entire address of the account holder. This attribute should only be used if you are unable to provide the address information in
   * the 5 separate attributes above (AddressCountry, AddressPostalCode, AddressCity, AddressLine1 and AddressLine2).
   *
   * <pre>{@code Birgerstreet 14, SE-11411, Stockholm, Sweden}</pre>
   */
  address?: string;

  /**
   * The email address of the account holder.
   *
   * <pre>{@code test@trustly.com}</pre>
   */
  email?: string;
}