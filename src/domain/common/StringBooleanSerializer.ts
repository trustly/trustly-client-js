import {java} from 'jree';

export class StringBooleanSerializer extends StdSerializer<java.lang.Boolean> {

  protected constructor() {
    super(java.lang.Boolean.class);
  }

  public serialize(value: java.lang.Boolean | null, gen: JsonGenerator | null, provider: SerializerProvider | null): void {
    gen.writeString(java.lang.Boolean.TRUE.equals(value) ? '1' : '0');
  }
}
