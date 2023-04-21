import {AbstractResponseResultData} from '../../base/AbstractResponseResultData';
import {SettlementReportResponseDataEntry} from './SettlementReportResponseDataEntry';

export interface SettlementReportResponseData extends AbstractResponseResultData {

  csvContent?: string;

  entries: SettlementReportResponseDataEntry[];
}
