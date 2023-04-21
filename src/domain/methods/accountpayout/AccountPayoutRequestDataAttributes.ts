import {AbstractRequestParamsDataAttributes} from '../../base/AbstractRequestParamsDataAttributes';
import {RecipientOrSenderInformation} from '../../common/RecipientOrSenderInformation';

export interface AccountPayoutRequestDataAttributes extends AbstractRequestParamsDataAttributes {

  /**
   * The text to show on the end-user's bank statement after Trustly's own 10 digit reference (which always will be displayed first). The
   * reference must let the end user identify the merchant based on this value. So the ShopperStatement should contain either your brand
   * name, website name, or company name.
   * <p>
   * If possible, try to keep this text as short as possible to maximise the chance that the full reference will fit into the reference
   * field on the customer's bank since some banks allow only a limited number of characters.
   */
  shopperStatement?: string;

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
   * <p>
   * Mandatory attribute for Trustly Partners that are using Express Merchant Onboarding and aggregate traffic under a master processing
   * account. It is also mandatory for E-wallets used directly in a merchant's checkout, whereby the purpose of a Trustly transaction is to
   * pay for goods/services by placing funds on the payer's e-money account ("funding stage") following an immediate transfer into the
   * e-money account of the payee ( "payment" stage).
   */
  pspMerchant?: string;

  /**
   * URL of the consumer-facing website where the order is initiated
   *
   * <p>
   * Note: Mandatory attribute for Trustly Partners that are using Express Merchant Onboarding (EMO) and aggregate traffic under a master
   * processing account. It is also mandatory for E-wallets used directly in a merchant's checkout.
   * <p>
   * Mandatory attributes for Trustly Partners that are using Express Merchant Onboarding and aggregate traffic under a master processing
   * account. It is also mandatory for E-wallets used directly in a merchant's checkout, whereby the purpose of a Trustly transaction is to
   * pay for goods/services by placing funds on the payer's e-money account ("funding stage") following an immediate transfer into the
   * e-money account of the payee ( "payment" stage).
   */
  pspMerchantUrl?: string;

  /**
   * VISA category codes describing the merchant's nature of business.
   *
   * <p>
   * Note: Mandatory attribute for Trustly Partners that are using Express Merchant Onboarding (EMO) and aggregate traffic under a master
   * processing account. It is also mandatory for E-wallets used directly in a merchant's checkout.
   * <p>
   * Mandatory attributes for Trustly Partners that are using Express Merchant Onboarding and aggregate traffic under a master processing
   * account. It is also mandatory for E-wallets used directly in a merchant's checkout, whereby the purpose of a Trustly transaction is to
   * pay for goods/services by placing funds on the payer's e-money account ("funding stage") following an immediate transfer into the
   * e-money account of the payee ( "payment" stage).
   */
  merchantCategoryCode?: string;

  /**
   * Information about the Payer (ultimate debtor). This is required for some merchants and partners, see below.
   * <p>
   * SenderInformation is mandatory to send in Attributes{} for money transfer services (including remittance houses), e-wallets, prepaid
   * cards, as well as for Trustly Partners that are using Express Merchant Onboarding and aggregate traffic under a master processing
   * account (other cases may also apply).
   */
  senderInformation: RecipientOrSenderInformation | null;
}
