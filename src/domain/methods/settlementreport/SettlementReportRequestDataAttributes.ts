import {AbstractRequestParamsDataAttributes} from '../../base/AbstractRequestParamsDataAttributes';

export interface SettlementReportRequestDataAttributes extends AbstractRequestParamsDataAttributes {

  /**
   * Required. The APIVersion.
   *
   * <p>Must be "1.2". We also have older versions of the report, but those should not be implemented by new merchants.</p>
   *
   * <pre>{@code 1.2}</pre>
   */
  apiVersion?: "1.2" | string;
}
