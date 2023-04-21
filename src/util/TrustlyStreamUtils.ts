export class TrustlyStreamUtils {

  public static readerToString(reader: unknown): string {

    throw new Error(`Implement this, for reading ${JSON.stringify(reader)}`);

    // let  in: java.io.BufferedReader = new  java.io.BufferedReader(reader);
    // let  inputLine: string;
    // let  sb: java.lang.StringBuilder = new  java.lang.StringBuilder();
    // while ((inputLine = in.readLine()) !== null) {
    //   sb.append(inputLine);
    // }
    // in.close();
    //
    // return sb.toString();
  }
}
