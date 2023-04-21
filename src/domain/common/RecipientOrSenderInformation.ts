export interface RecipientOrSenderInformation {

  /**
   * Partytype can be "PERSON" or "ORGANISATION" (if the recipient or ultimate debtor is an organisation/company).
   */
  partytype?: string;

  /**
   * First name of the person, or the name of the organisation.
   */
  firstname?: string;

  /**
   * Last name of the person (NULL for organisation).
   */
  lastname?: string;

  /**
   * The ISO 3166-1-alpha-2 code of the country that the recipient resides in.
   */
  countryCode?: string;

  /**
   * Payment account number or an alternative consistent unique identifier(e.g.customer number). Note: this is not a transaction ID or
   * similar.This identifier must stay consistent across all transactions relating to this recipient (payee).
   */
  customerID?: string;

  /**
   * Full address of the recipient, excluding the country.
   */
  address?: string;

  /**
   * Date of birth (YYYY-MM-DD) of the beneficiary, or organisational number for the organisation.
   */
  dateOfBirth?: string;
}
