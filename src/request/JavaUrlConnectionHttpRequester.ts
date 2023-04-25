import {HttpRequester} from './HttpRequester';
import {TrustlyApiClientSettings} from '../client/TrustlyApiClientSettings';
import {TrustlyStreamUtils} from '../util/TrustlyStreamUtils';

export class JavaUrlConnectionHttpRequester implements HttpRequester {

  public request(settings: TrustlyApiClientSettings, request: string): string {

    const requestBytes: Int8Array = request.getBytes(java.nio.charset.StandardCharsets.UTF_8);

    const url: java.net.URL = new java.net.URL(settings.getUrl());
    const con: java.net.HttpURLConnection = url.openConnection() as java.net.HttpURLConnection;

    con.setRequestMethod('POST');
    con.setRequestProperty('Content-Type', 'application/json');
    con.setRequestProperty('Content-Length', string.valueOf(requestBytes.length));
    con.setRequestProperty('Accept', 'application/json');
    con.setDoOutput(true);

    {
// This holds the final error to throw (if any).
      let error: java.lang.Throwable | undefined;

      const os: java.io.OutputStream = con.getOutputStream();
      try {
        try {
          os.write(requestBytes, 0, requestBytes.length);
        } finally {
          error = closeResources([os]);
        }
      } catch (e) {
        error = handleResourceError(e, error);
      } finally {
        throwResourceError(error);
      }
    }


    const status: int = con.getResponseCode();

    let sr: java.io.Reader;
    if (status > 299) {
      sr = new java.io.InputStreamReader(con.getErrorStream(), java.nio.charset.StandardCharsets.UTF_8);
    } else {
      sr = new java.io.InputStreamReader(con.getInputStream(), java.nio.charset.StandardCharsets.UTF_8);
    }

    return TrustlyStreamUtils.readerToString(sr);
  }
}
