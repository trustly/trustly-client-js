import * as fs from 'fs';

export class TrustlyFileUtils {

  public static readAllText(path: string): string {

    return fs.readFileSync(path).toString();

    // throw new Error(`Implement this, for reading ${path}!`);

    //return new string(java.nio.file.Files.readAllBytes(java.nio.file.Paths.get(path)), java.nio.charset.StandardCharsets.UTF_8);
  }
}
