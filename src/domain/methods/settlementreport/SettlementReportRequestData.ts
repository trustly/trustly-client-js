import {AbstractToTrustlyRequestData} from '../../base/AbstractToTrustlyRequestData';
import {SettlementReportRequestDataAttributes} from './SettlementReportRequestDataAttributes';

export interface SettlementReportRequestData extends AbstractToTrustlyRequestData<SettlementReportRequestDataAttributes> {

  /**
   * If the value is specified (i.e. not "null"), the system will only search for a settlement executed in that particular currency. If
   * unspecified, settlements executed in any currency are included in the report.
   */
  Currency?: string;

  /**
   * The date when the settlement was processed.
   *
   * <pre>{@code 2014-04-01}</pre>
   */
  SettlementDate?: string;
}


