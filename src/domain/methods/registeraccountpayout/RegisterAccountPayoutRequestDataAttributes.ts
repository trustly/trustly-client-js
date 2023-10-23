import {AbstractRequestParamsDataAttributes} from '../../base/AbstractRequestParamsDataAttributes';
import {RecipientOrSenderInformation} from '../../common/RecipientOrSenderInformation';


export interface RegisterAccountPayoutRequestDataAttributes extends AbstractRequestParamsDataAttributes {

  /**
   * The text to show on the end-user's bank statement after Trustly's own 10 digit reference (which always will be displayed first). The
   * reference must let the end user identify the merchant based on this value. So the ShopperStatement should contain either your brand
   * name, website name, or company name.
   * <p>
   * If possible, try to keep this text as short as possible to maximise the chance that the full reference will fit into the reference
   * field on the customer's bank since some banks allow only a limited number of characters.
   */
  ShopperStatement: string;

  /**
   * *The ExternalReference is a reference set by the merchant for any purpose and does not need to be unique    *for every API call. The
   * ExternalReference will be included in version 1.2 of the settlement report, ViewAutomaticSettlementDetailsCSV.
   */
  ExternalReference?: string;

  /**
   * Human-readable identifier of the consumer-facing merchant (e.g. legal name or trade name)
   *
   * <p>
   * Note: Mandatory attribute for Trustly Partners that are using Express Merchant Onboarding (EMO) and aggregate traffic under a master
   * processing account. It is also mandatory for E-wallets used directly in a merchant's checkout.
   * </p>
   */
  PSPMerchant?: string;

  /**
   * URL of the consumer-facing website where the order is initiated
   *
   * <p>
   * Note: Mandatory attribute for Trustly Partners that are using Express Merchant Onboarding (EMO) and aggregate traffic under a master
   * processing account. It is also mandatory for E-wallets used directly in a merchant's checkout.
   * </p>
   */
  PSPMerchantURL?: string;

  /**
   * VISA category codes describing the merchant's nature of business.
   *
   * <p>
   * Note: Mandatory attribute for Trustly Partners that are using Express Merchant Onboarding (EMO) and aggregate traffic under a master
   * processing account. It is also mandatory for E-wallets used directly in a merchant's checkout.
   * </p>
   */
  MerchantCategoryCode?: string;

  /**
   * Information about the Payer (ultimate debtor). This is required for some merchants and partners, see below.
   */
  SenderInformation?: RecipientOrSenderInformation;

  /**
   * The end-user's date of birth.
   *
   * <pre>{@code 1979-01-31}</pre>
   */
  DateOfBirth?: string;

  /**
   * The mobile phonenumber to the account holder in international format. This is used for KYC and AML routines.
   *
   * <pre>{@code +46709876543}</pre>
   */
  MobilePhone?: string;

  /**
   * The account holder's social security number / personal number / birth number / etc. Useful for some banks for identifying transactions
   * and KYC/AML.
   *
   * <pre>{@code 790131-1234}</pre>
   */
  NationalIdentificationNumber?: string;

  /**
   * The ISO 3166-1-alpha-2 code of the account holder's country.
   *
   * <pre>{@code SE}</pre>
   */
  AddressCountry?: string;

  /**
   * Postal code of the account holder.
   *
   * <pre>{@code SE-11253}</pre>
   */
  AddressPostalCode?: string;

  /**
   * City of the account holder.
   *
   * <pre>{@code Stockholm}</pre>
   */
  AddressCity?: string;

  /**
   * Street address of the account holder.
   *
   * <pre>{@code Main street 1}</pre>
   */
  AddressLine1?: string;

  /**
   * Additional address information of the account holder.
   *
   * <pre>{@code Apartment 123, 2 stairs up}</pre>
   */
  AddressLine2?: string;

  /**
   * The entire address of the account holder. This attribute should only be used if you are unable to provide the address information in
   * the 5 separate attributes above (AddressCountry, AddressPostalCode, AddressCity, AddressLine1 and AddressLine2).
   *
   * <pre>{@code Birgerstreet 14, SE-11411 Stockholm, Sweden}</pre>
   */
  Address?: string;

  /**
   * The email address of the account holder.
   *
   * <pre>{@code test@trustly.com}</pre>
   */
  Email?: string;
}
