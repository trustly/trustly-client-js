import {AbstractRequestParamsDataAttributes} from '../../base/AbstractRequestParamsDataAttributes';

export interface RefundRequestDataAttributes extends AbstractRequestParamsDataAttributes {

  /**
   * This is a reference set by the merchant for any purpose and does not need to be unique for every API call.
   * <p>
   * This will be included in version {@code 1.2} of the settlement report, {@code ViewAutomaticSettlementDetailsCSV}.
   */
  ExternalReference?: string;
}
