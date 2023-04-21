export interface SettlementReportResponseDataEntry {

  /**
   * The account the money was transferred from(if the amount is positive), or the account the money was transferred to(if the amount is
   * negative).
   */
  accountName?: string;

  /**
   * The monetary amount of the transaction, rounded down to two decimal places.
   */
  amount?: number;

  /**
   * The three-letter currency code of the transaction.
   */
  currency?: string;

  /**
   * The timestamp of the transaction, including the UTC offset.As the timestamps are always in UTC, the offset is always +00
   *
   * <pre>{@code 2014-03-31 11:50:06.46106+00}</pre>
   */
  datestamp?: Date | string | number;

  /**
   * MessageID of the order associated with the transaction, if available.
   */
  messageId?: string;

  /**
   * OrderID of the order associated with the transaction, if available.
   */
  orderId?: string;

  /**
   * The type of the order associated with the transaction, if available.Text See list of possible orderypes in the table below.
   */
  orderType?: string;

  /**
   * The sum of all amounts of the respective currency within the report.
   */
  total?: number;

  /**
   * The username of the child merchant account.
   */
  username?: string;

  /**
   * The amount that the end user paid, if the currency is different from the requested deposit currency. For transactions where the payment
   * currency is the same as the requested currency, this field will be empty.
   */
  fxPaymentAmount?: number;

  /**
   * The currency that the user paid with, if the currency is different from the requested deposit currency. For transactions where the
   * payment currency is the same as the requested currency, this field will be empty.
   */
  fxPaymentCurrency?: string;

  /**
   * The 10 digit reference that will show up on the merchant's bank statement for this automatic settlement batch. The same value will be
   * sent on every row in the report.
   */
  settlementBankWithdrawalId?: string;

  /**
   * Contains the ExternalReference value for Deposit, Charge, and Refund transactions if provided.Otherwise empty.
   */
  externalReference?: string;
}
