import {AbstractAmountConstrainedAccountDataAttributes} from '../../common/AbstractAmountConstrainedAccountDataAttributes';
import {RecipientOrSenderInformation} from '../../common/RecipientOrSenderInformation';


export interface DepositRequestDataAttributes extends AbstractAmountConstrainedAccountDataAttributes {

  /**
   * iDeal.
   * <p>
   * The iDEAL integration offered by Trustly allows for both iDEAL and Trustly payments on a single integration with all transactions
   * visible in the same AccountLedger. To initiate a new iDEAL payment, add Method = "deposit.bank.netherlands.ideal" to the Deposit
   * attributes.
   */
  method?: string;

  /**
   * The currency of the end-user's account in the merchant's system.
   */
  currency?: string;

  /**
   * The amount to deposit with exactly two decimals in the currency specified by Currency. Do not use this attribute in combination with
   * {@link DepositRequestDataAttributes#getSuggestedMinAmount()} and {@link DepositRequestDataAttributes#getSuggestedMaxAmount()}. Only
   * digits. Use dot (.) as decimal separator.
   */

  amount?: string;

  /**
   * The ISO 3166-1-alpha-2 code of the shipping address country.
   */
  shippingAddressCountry?: string;

  /**
   * The postalcode of the shipping address.
   */
  shippingAddressPostalCode?: string;

  /**
   * The city of the shipping address.
   */
  shippingAddressCity?: string;

  /**
   * Shipping address street
   */
  shippingAddressLine1?: string;

  /**
   * Additional shipping address information.
   */
  shippingAddressLine2?: string;

  /**
   * The entire shipping address.
   * <p>
   * This attribute should only be used if you are unable to provide the shipping address information in the 5 separate attributes:
   * <ul>
   *   <li>{@link DepositRequestDataAttributes#shippingAddressCountry}</li>
   *   <li>{@link DepositRequestDataAttributes#shippingAddressCity}</li>
   *   <li>{@link DepositRequestDataAttributes#shippingAddressPostalCode}</li>
   *   <li>{@link DepositRequestDataAttributes#shippingAddressLine1}</li>
   *   <li>{@link DepositRequestDataAttributes#shippingAddressLine2}</li>
   * </ul>
   */
  shippingAddress?: string;

  /**
   * In addition to the deposit, request a direct debit mandate from the account used for the deposit. 1 enables, 0 disables. The default is
   * disabled. If this attribute is set, additional account notifications might be sent. You can read more about Trustly Direct Debit here,
   * under section 2.1
   */
  requestDirectDebitMandate?: string;

  /**
   * The AccountID received from an account notification which shall be charged in a Trustly Direct Debit deposit. This attribute should
   * only be sent in combination with "QuickDeposit" : 1
   */
  chargeAccountId?: string;

  /**
   * Set to 1 for Trustly Direct Debit deposits. QuickDeposit should be set set to 1 when the end user attempts a quick deposit, even if
   * ChargeAccountID is not set. You can read more about QuickDeposits here, under section 1.1 and 1.2.
   */
  quickDeposit: number | null;

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
   * processing account. It is also mandatory for E-wallets used directly in a merchant's checkout.
   * </p>
   */
  pspMerchant?: string;

  /**
   * URL of the consumer-facing website where the order is initiated
   *
   * <p>
   * Note: Mandatory attribute for Trustly Partners that are using Express Merchant Onboarding (EMO) and aggregate traffic under a master
   * processing account. It is also mandatory for E-wallets used directly in a merchant's checkout.
   * </p>
   */
  pspMerchantUrl?: string;

  /**
   * VISA category codes describing the merchant's nature of business.
   *
   * <p>
   * Note: Mandatory attribute for Trustly Partners that are using Express Merchant Onboarding (EMO) and aggregate traffic under a master
   * processing account. It is also mandatory for E-wallets used directly in a merchant's checkout.
   * </p>
   */
  merchantCategoryCode?: string;

  /**
   * The AccountID of a returning customer. Allows for a quicker payment experience in some markets, see Trustly Express.
   */
  accountId?: string;

  /**
   * Information about the Payee (ultimate creditor). The burden of identifying who the Payee for any given transaction is lies with the
   * Trustly customer.
   * <p>
   * Required for some merchants and partners.
   * <p>
   * RecipientInformation is mandatory to send for money transfer services (including remittance houses), e-wallets, prepaid cards, as
   * well as for Trustly Partners that are using Express Merchant Onboarding and aggregate traffic under a master processing account (other
   * cases may also apply).
   */
  recipientInformation?: RecipientOrSenderInformation;
}
