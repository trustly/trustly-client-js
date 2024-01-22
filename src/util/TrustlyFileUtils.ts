import * as fs from 'fs';

export class TrustlyFileUtils {

  public static readAllText(path: string): string {
    return fs.readFileSync(path).toString();
  }
}
