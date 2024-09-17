import {OrderType, SettlementReportResponseDataEntry} from "./models";

type Mapper = (row: SettlementReportResponseDataEntry, original: string) => void

export class SettlementReportParser {

  private static readonly NOOP_MAPPER: Mapper = () => {
    // Does nothing
  };

  private readonly mappers: Map<string, Mapper> = new Map<string, Mapper>();

  private addMapper(csvKey: string, mapper: Mapper) {
    this.mappers.set(csvKey, mapper);
  }

  public constructor() {
    this.addMapper('accountname', (row, v) => row.accountName = v);
    this.addMapper('currency', (row, v) => row.currency = v);
    this.addMapper('messageid', (row, v) => row.messageId = v);
    this.addMapper('orderid', (row, v) => row.orderid = v);
    this.addMapper('ordertype', (row, v) => {
      if (Object.values(OrderType).map(it => it as string).indexOf(v) == -1) {
        console.warn(`Unknown OrderType '${v}', will silently pass through as if an OrderType`);
      }
      row.orderType = v as OrderType;
    });
    this.addMapper('username', (row, v) => row.username = v);
    this.addMapper('fxpaymentcurrency', (row, v) => row.fxPaymentCurrency = v);
    this.addMapper('settlementbankwithdrawalid', (row, v) => row.settlementBankWithdrawalId = v);
    this.addMapper('externalreference', (row, v) => row.externalReference = v);

    this.addMapper('amount', (row, v) => row.amount = parseFloat(v));
    this.addMapper('fxpaymentamount', (row, v) => row.fxPaymentAmount = parseFloat(v));
    this.addMapper('total', (row, v) => row.total = parseFloat(v));

    this.addMapper('datestamp', (row, v) => {

      row.datestamp = v;

      // TODO: Reintroduce?
      // 2014-03-31 11:50:06.46106+00
      // const regex = /^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})[T ]([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})\.?([0-9]{0,8})(?:\+([0-9]{1,2}))?$/g;
      //
      // for (const match of v.matchAll(regex)) {
      //
      //   const [year, month, day, hours, minutes, seconds, ms] =
      //     [
      //       parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), parseInt(match[4]), parseInt(match[5]), parseInt(match[6]),
      //       match[7] ? parseInt(match[7]) : 0
      //     ];
      //
      //   if (year) {
      //     row.datestamp = new Date(year, month, day, hours, minutes, seconds, ms);
      //     return;
      //   }
      // }
      //
      // throw new Error('Unknown date format exception');
    });
  }

  public parse(csv: string): SettlementReportResponseDataEntry[] {
    const lines: string[] = csv.replace('\r', '').trim().split('\n');
    const rows: SettlementReportResponseDataEntry[] = [];

    if (lines.length === 0) {
      return rows;
    }

    const headers: string[] = lines[0].split(',');

    const localMappers: Mapper[] = [];
    for (const header of headers) {
      const lowerCaseHeaderKey = header.toLowerCase();
      const mapper: Mapper = this.mappers.get(lowerCaseHeaderKey)
        // We do not recognize this new header key.
        // This could count as an error, but we will let it go.
        // The preferred way would perhaps be to log about the lost data,
        // but we do not want to include a dependency on a logging library.
        ?? SettlementReportParser.NOOP_MAPPER;

      localMappers.push(mapper);
    }

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line === null || line == '') {
        continue;
      }

      const fieldsValues: string[] = this.getFieldValues(line);

      const row: Partial<SettlementReportResponseDataEntry> = {}; // SettlementReportResponseDataEntry.builder();
      for (let columnIndex = 0; columnIndex < fieldsValues.length; columnIndex++) {
        if (fieldsValues[columnIndex]) {
          localMappers[columnIndex](row, fieldsValues[columnIndex]); //.map(rowBuilder, fieldsValues[columnIndex]);
        }
      }

      rows.push(row);
    }

    return rows;
  }

  private getFieldValues(line: string): string[] {
    const tokens: string[] = [];

    const buffer: string[] = [];
    let insideQuote = false;

    for (let i = 0; i < line.length; i++) {
      const c = line.charAt(i);
      if (insideQuote) {
        if (c === '"') {
          insideQuote = false;
        } else {
          buffer.push(c);
        }
      } else {
        if (c === '"') {
          insideQuote = true;
        } else if (c === ',') {
          tokens.push(buffer.join('').toString());
          buffer.length = 0; //.setLength(0);
        } else {
          buffer.push(c);
        }
      }
    }

    if (buffer.length > 0) {
      tokens.push(buffer.join('').toString());
      buffer.length = 0;
    }

    return tokens; // .toArray(new Array<string>(0));
  }
}
