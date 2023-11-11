export type VideSource<T> = (() => T) & ((value: T) => T)
