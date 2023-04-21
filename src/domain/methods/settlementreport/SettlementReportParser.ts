


import { java, JavaObject, int, char } from "jree";

export interface Mapper {

  map(row: SettlementReportResponseDataEntryBuilder| null, value: string| null): void;
}

export  class SettlementReportParser extends JavaObject {

  private static readonly NOOP_MAPPER: Mapper = (row, value) => {
  };

  private static readonly DATE_TIME_FORMATTERS:  java.time.format.DateTimeFormatter[] | null =  [

    new  java.time.format.DateTimeFormatterBuilder()
      .parseCaseInsensitive()
      .append(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE)
      .appendLiteral(' ')
      .append(java.time.format.DateTimeFormatter.ISO_LOCAL_TIME)
      .appendOffsetId()
      .toFormatter(java.util.Locale.ROOT),

    java.time.format.DateTimeFormatter.ISO_DATE_TIME,
    java.time.format.DateTimeFormatter.ISO_INSTANT
  ];

  private readonly mappers:  java.util.Map<string, SettlementReportParser.Mapper> | null = new  java.util.HashMap();

  public constructor() {
    super();
this.mappers.put("accountname", SettlementReportResponseDataEntryBuilder.accountName);
    this.mappers.put("currency", SettlementReportResponseDataEntryBuilder.currency);
    this.mappers.put("messageid", SettlementReportResponseDataEntryBuilder.messageId);
    this.mappers.put("orderid", SettlementReportResponseDataEntryBuilder.orderId);
    this.mappers.put("ordertype", SettlementReportResponseDataEntryBuilder.orderType);
    this.mappers.put("username", SettlementReportResponseDataEntryBuilder.username);
    this.mappers.put("fxpaymentcurrency", SettlementReportResponseDataEntryBuilder.fxPaymentCurrency);
    this.mappers.put("settlementbankwithdrawalid", SettlementReportResponseDataEntryBuilder.settlementBankWithdrawalId);
    this.mappers.put("externalreference", SettlementReportResponseDataEntryBuilder.externalReference);

    this.mappers.put("amount", (row, value) => row.amount(java.lang.Double.parseDouble(java.nio.file.attribute.FileAttribute.value)));
    this.mappers.put("fxpaymentamount", (row, value) => row.fxPaymentAmount(java.lang.Double.parseDouble(java.nio.file.attribute.FileAttribute.value)));
    this.mappers.put("total", (row, value) => row.total(java.lang.Double.parseDouble(java.nio.file.attribute.FileAttribute.value)));

    this.mappers.put("datestamp", (row, value) => {

      const  exceptions: java.util.List<java.time.format.DateTimeParseException> = new  java.util.ArrayList();
      for (const formatter of SettlementReportParser.DATE_TIME_FORMATTERS) {
        try {
          row.datestamp(formatter.parse(java.nio.file.attribute.FileAttribute.value, java.time.Instant.from));
          return;
        } catch (ex) {
if (ex instanceof java.time.format.DateTimeParseException) {
          exceptions.add(ex);
        } else {
	throw ex;
	}
}
      }

      throw exceptions.stream().findFirst().orElseThrow(() => new  java.lang.IllegalStateException("Unknown date format exception"));
    });
  }

  public parse(csv: string| null):  java.util.List<SettlementReportResponseDataEntry> | null {
    const  lines: string[] = csv.replace("\r", "").trim().split("\n");
    const  rows: java.util.List<SettlementReportResponseDataEntry> = new  java.util.ArrayList();

    if (lines.length === 0) {
      return rows;
    }

    const  headers: string[] = lines[0].split(",");

    const  localMappers: java.util.List<SettlementReportParser.Mapper> = new  java.util.ArrayList();
    for (const header of headers) {
      const  lowerCaseHeaderKey: string = header.toLowerCase(java.util.Locale.ROOT);
      if (this.mappers.containsKey(lowerCaseHeaderKey)) {
        localMappers.add(this.mappers.get(lowerCaseHeaderKey));
      } else {
        // We do not recognize this new header key.
        // This could count as an error, but we will let it go.
        // The preferred way would perhaps be to log about the lost data,
        // but we do not want to include a dependency on a logging library.
        localMappers.add(SettlementReportParser.NOOP_MAPPER);
      }
    }

    for (let  i: int = 1; i < lines.length; i++) {
      const  line: string = lines[i];
      if (line === null || line.isEmpty()) {
        continue;
      }

      const  fieldsValues: string[] = this.getFieldValues(line);

      const  rowBuilder: SettlementReportResponseDataEntryBuilder = SettlementReportResponseDataEntry.builder();
      for (let  columnIndex: int = 0; columnIndex < fieldsValues.length; columnIndex++) {
        if (fieldsValues[columnIndex] !== null && !fieldsValues[columnIndex].isEmpty()) {
          localMappers.get(columnIndex).map(rowBuilder, fieldsValues[columnIndex]);
        }
      }

      rows.add(rowBuilder.build());
    }

    return rows;
  }

  private getFieldValues(line: string| null):  string[] | null {
    const  tokens: java.util.List<string> = new  java.util.ArrayList();

    const  buffer: java.lang.StringBuilder = new  java.lang.StringBuilder();
    let  insideQuote = false;

    for (let  i: int = 0; i < line.length(); i++) {
      const  c: char = line.charAt(i);
      if (insideQuote) {
        if (c === '"') {
          insideQuote = false;
        } else {
          buffer.append(c);
        }
      } else {
        if (c === '"') {
          insideQuote = true;
        } else if (c === ',') {
          tokens.add(buffer.toString());
          buffer.setLength(0);
        } else {
          buffer.append(c);
        }
      }
    }

    if (buffer.length() > 0) {
      tokens.add(buffer.toString());
      buffer.setLength(0);
    }

    return tokens.toArray(new   Array<string>(0));
  }
}
