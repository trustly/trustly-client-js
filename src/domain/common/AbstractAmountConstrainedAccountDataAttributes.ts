import {AbstractAccountDataAttributes} from './AbstractAccountDataAttributes';

export interface AbstractAmountConstrainedAccountDataAttributes extends AbstractAccountDataAttributes {

  /**
   * The minimum amount the end-user is allowed to deposit in the currency specified by Currency.Only digits. Use dot (.) as decimal
   * separator.
   */
  SuggestedMinAmount?: string;

  /**
   * The maximum amount the end-user is allowed to deposit in the currency specified by Currency.Only digits. Use dot (.) as decimal
   * separator.
   */
  SuggestedMaxAmount?: string;
}
