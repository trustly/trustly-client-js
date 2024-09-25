export class TrustlyStringUtils {

  public static isBlank(value?: string | null | undefined) {

    if (!value) {
      return true;
    }

    if (value == '') {
      return true;
    }

    return value.trim() == '';
  }
}
