import {AbstractAccountDataAttributes} from '../../common/AbstractAccountDataAttributes';
import {NumberBoolean} from "../../base/NumberBoolean";

export interface SelectAccountRequestDataAttributes extends AbstractAccountDataAttributes {

  /**
   * Only for Trustly Direct Debit. Request a direct debit mandate from the selected account. 1 or 0. See section "Direct Debit Mandates"
   * below for details.
   * <p>
   * If this is set to 1, then {@link SelectAccountRequestDataAttributes#getEmail()} is required.
   */
  RequestDirectDebitMandate?: NumberBoolean;

  /**
   * The end-user's date of birth.
   *
   * <pre>{@code 1979-01-31}</pre>
   */
  DateOfBirth?: string;

  /**
   * Human-readable identifier of the consumer-facing merchant(e.g.legal name or trade name)
   *
   * <p>
   * Note:  Mandatory attribute for Trustly Partners that are using Express Merchant Onboarding(EMO) and aggregate traffic under a master
   * processing account.
   * </p>
   *
   * <pre>{@code Merchant Ltd.}</pre>
   */
  PSPMerchant?: string;

  /**
   * URL of the consumer-facing website where the order is initiated
   *
   * <p>
   * Note:  Mandatory attribute for Trustly Partners that are using Express Merchant Onboarding(EMO) and aggregate traffic under a master
   * processing account.
   * </p>
   *
   * <pre>{@code www.merchant.com}</pre>
   */
  PSPMerchantURL?: string;

  /**
   * VISA category codes describing the merchant's nature of business.
   *
   * <p>
   * Note: Mandatory attribute for Trustly Partners that are using Express Merchant Onboarding (EMO) and aggregate traffic under a master
   * processing account.
   * </p>
   */
  MerchantCategoryCode?: string;
}
