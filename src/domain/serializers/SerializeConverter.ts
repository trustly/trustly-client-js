
export interface SerializeConverter<T> {

  serialize(original: T): string;
}
