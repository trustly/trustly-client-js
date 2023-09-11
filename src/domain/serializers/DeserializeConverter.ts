
export interface DeserializeConverter<T> {

  deserialize(original: unknown): T;
}
