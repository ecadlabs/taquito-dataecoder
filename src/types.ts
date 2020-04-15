/**
 * Minimal interface implemented by `Array` and `TypedArray`
 */
export interface LiteArray<T> extends ArrayLike<T> {
    [Symbol.iterator](): IterableIterator<T>;
    map(callbackfn: (value: T, index: number, array: LiteArray<T>) => T, thisArg?: any): LiteArray<T>;
}

/**
 * Endianness conversion layer
 */
export interface ByteReader {
    readonly length: number;
    readBytes(len?: number): Uint8Array | null;
    reader(len?: number): ByteReader;
    readUint8(): number;
    readUint16(): number;
    readUint32(): number;
    readUint64(): bigint;
    readInt8(): number;
    readInt16(): number;
    readInt32(): number;
    readInt64(): bigint;
}

/**
 * Endianness conversion layer
 */
export interface ByteWriter {
    readonly length: number;
    writeBytes(val: LiteArray<number>): void;
    writeUint8(val: number | bigint): void;
    writeUint16(val: number | bigint): void;
    writeUint32(val: number | bigint): void;
    writeUint64(val: number | bigint): void;
    writeInt8(val: number | bigint): void;
    writeInt16(val: number | bigint): void;
    writeInt32(val: number | bigint): void;
    writeInt64(val: number | bigint): void;
}

export type Constructor<T = unknown> = new () => T;

/**
 * Callable or constructable object used to identify types in TypeScript runtime type data.
 * In other words a conversion function (non new-able constructor) for primitive types (`Number`, `String` etc) or a constructor for non primitive ones.
 */
export type TypeDesignator<T = unknown> = T extends object ? (new () => T) :
    T extends (string | number | bigint | boolean | symbol) ? (() => T) : (new () => T) | (() => T);

/**
 * Implemented by all encoding handlers
 */
export interface Encoding<T = unknown> {
    marshal(w: ByteWriter, value?: T): void;
    unmarshal(r: ByteReader, td?: TypeDesignator<T>): T;
}

/**
 * User defined custom serialization method.
 * The class must be annotated with {@link marshallable} decorator for this feature to work.
 */
export interface Marshallable {
    marshal(w: ByteWriter): void;
}

/**
 * Type which must be deserialized by passing {@link ByteReader} to its constructor.
 * The class must be annotated with {@link unmarshallable} decorator for this feature to work.
 */
export type Unmarshallable<T> = new (r: ByteReader) => T;