import {AbstractResponseResultData} from '../../base/AbstractResponseResultData';
import {SettlementReportResponseDataEntry} from './SettlementReportResponseDataEntry';

export interface UnparsedSettlementReportResponseData extends AbstractResponseResultData {

  view_automatic_settlement_details: string;
}

export interface SettlementReportResponseData extends AbstractResponseResultData {

  entries: SettlementReportResponseDataEntry[];
}
