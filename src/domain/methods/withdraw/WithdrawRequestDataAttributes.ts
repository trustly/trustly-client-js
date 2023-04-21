import {AbstractAmountConstrainedAccountDataAttributes} from '../../common/AbstractAmountConstrainedAccountDataAttributes';
import {RecipientOrSenderInformation} from '../../common/RecipientOrSenderInformation';


export interface WithdrawRequestDataAttributes extends AbstractAmountConstrainedAccountDataAttributes {

  /**
   * Sets a fixed withdrawal amount which cannot be changed by the end-user in the Trustly iframe. If this attribute is not sent, the
   * end-user will be asked to select the withdrawal amount in the Trustly iframe
   * <p>
   * Do not use in combination with {@link WithdrawRequestDataAttributes#getSuggestedMinAmount()} and
   * {@link WithdrawRequestDataAttributes#getSuggestedMaxAmount()}.
   * <p>
   * Use dot(.) as decimal separator.
   */
  suggestedAmount?: string;

  /**
   * The end-user's first name.
   */
  dateOfBirth?: string;

  /**
   * The ISO 3166-1-alpha-2 code of the shipping address country.
   */
  addressCountry?: string;

  /**
   * The postalcode of the shipping address.
   */
  addressPostalCode?: string;

  /**
   * The city of the shipping address.
   */
  addressCity?: string;

  /**
   * Shipping address street
   */
  addressLine1?: string;

  /**
   * Additional shipping address information.
   */
  addressLine2?: string;

  /**
   * The entire shipping address.
   * <p>
   * This attribute should only be used if you are unable to provide the shipping address information in the 5 separate properties:
   * <ul>
   *   <li>{@link WithdrawRequestDataAttributes#getAddressCountry()}</li>
   *   <li>{@link WithdrawRequestDataAttributes#getAddressCity()}</li>
   *   <li>{@link WithdrawRequestDataAttributes#getAddressPostalCode()}</li>
   *   <li>{@link WithdrawRequestDataAttributes#getAddressLine1()}</li>
   *   <li>{@link WithdrawRequestDataAttributes#getAddressLine2()}</li>
   * </ul>
   */
  address?: string;

  /**
   * The ExternalReference is a reference set by the merchant for any purpose and does not need to be unique for every API call. The
   * ExternalReference will be included in version 1.2 of the settlement report, ViewAutomaticSettlementDetailsCSV.
   */
  externalReference?: string;

  /**
   * Human-readable identifier of the consumer-facing merchant (e.g. legal name or trade name)
   *
   * <p>
   * Note: Mandatory attribute for Trustly Partners that are using Express Merchant Onboarding (EMO) and aggregate traffic under a master
   * processing account.
   * </p>
   */
  pspMerchant?: string;

  /**
   * URL of the consumer-facing website where the order is initiated
   *
   * <p>
   * Note: Mandatory attribute for Trustly Partners that are using Express Merchant Onboarding (EMO) and aggregate traffic under a master
   * processing account.
   * </p>
   */
  pspMerchantUrl?: string;

  /**
   * VISA category codes describing the merchant's nature of business.
   *
   * <p>
   * Note: Mandatory attribute for Trustly Partners that are using Express Merchant Onboarding (EMO) and aggregate traffic under a master
   * processing account.
   * </p>
   */
  merchantCategoryCode?: string;

  /**
   * Information about the Payer (ultimate debtor).
   * <p>
   * SenderInformation is mandatory for money transfer services (including remittance houses), e-wallets, prepaid cards, as well as for
   * Trustly Partners that are using Express Merchant Onboarding and aggregate traffic under a master processing account (other cases may
   * also apply).
   */
  senderInformation?: RecipientOrSenderInformation;
}
