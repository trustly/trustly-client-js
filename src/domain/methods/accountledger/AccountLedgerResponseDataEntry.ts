export interface AccountLedgerResponseDataEntry {

  /**
   * Your userid in our system.
   */
  userid?: string;

  /**
   * The datestamp for when this ledger row affected your balance in our system.
   */
  datestamp?: string;

  /**
   * The globally unique OrderID that resulted in this ledger record.
   */
  orderid?: string;

  /**
   * The name of the bookkeeping account this ledger record belongs to.
   */
  accountname?: string;

  /**
   * Your unique MessageID that you used to create the order that resulted in this ledger record.
   */
  messageid?: string;

  /**
   * A human friendly description of this ledger record.
   */
  transactiontype?: string;

  /**
   * The currency of the amount in this ledger record.
   */
  currency?: string;

  /**
   * The amount your balance in our system was affected with due to this ledger record. May contain a lot of decimals.
   */
  amount?: string;

  /**
   * An ID meaning different things for different payment methods, you probably don't need this data.
   */
  gluepayid?: string;
}
