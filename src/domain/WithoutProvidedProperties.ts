
export type WithoutProvidedProperties<T extends object> = Omit<T, ('Username' | 'Password')>
