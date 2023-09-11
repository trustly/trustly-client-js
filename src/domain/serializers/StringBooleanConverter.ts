import {DeserializeConverter} from './DeserializeConverter';
import {SerializeConverter} from './SerializeConverter';

export class StringBooleanConverter implements DeserializeConverter<boolean>, SerializeConverter<boolean> {

  public deserialize(original: unknown): boolean {

    if (typeof original === 'boolean') {
      return original;
    } else if (typeof original === 'string') {
      return '1' === original || 'true' === original;
    } else {
      return !!original;
    }
  }

  public serialize(value: boolean): string {
    return value ? '1' : '0';
  }
}
