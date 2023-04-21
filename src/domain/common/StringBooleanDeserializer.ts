import {java} from 'jree';

export class StringBooleanDeserializer extends StdDeserializer<java.lang.Boolean> {

  protected constructor() {
    super(java.lang.Boolean.class);
  }

  public deserialize(p: JsonParser | null, ctxt: DeserializationContext | null): java.lang.Boolean | null {
    const valueString: string = p.getValueAsString('');
    return '1'.equals(valueString);
  }
}
