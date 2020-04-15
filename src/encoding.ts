import { Encoding, ByteReader, ByteWriter, TypeDesignator, Marshallable, Unmarshallable } from "./types";
import { Writer } from "./writer";
import { Encoder } from "./encoder";
import { Decoder } from "./decoder";
import "reflect-metadata";

const Uint8Encoding: Encoding<number> = {
    marshal: (w: ByteWriter, value?: number) => w.writeUint8(value || 0),
    unmarshal: (r: ByteReader) => r.readUint8(),
};

const Int8Encoding: Encoding<number> = {
    marshal: (w: ByteWriter, value?: number) => w.writeInt8(value || 0),
    unmarshal: (r: ByteReader) => r.readInt8(),
};

const Uint16Encoding: Encoding<number> = {
    marshal: (w: ByteWriter, value?: number) => w.writeUint16(value || 0),
    unmarshal: (r: ByteReader) => r.readUint16(),
};

const Int16Encoding: Encoding<number> = {
    marshal: (w: ByteWriter, value?: number) => w.writeInt16(value || 0),
    unmarshal: (r: ByteReader) => r.readInt16(),
};

const Uint32Encoding: Encoding<number> = {
    marshal: (w: ByteWriter, value?: number) => w.writeUint32(value || 0),
    unmarshal: (r: ByteReader) => r.readUint32(),
};

const Int32Encoding: Encoding<number> = {
    marshal: (w: ByteWriter, value?: number) => w.writeInt32(value || 0),
    unmarshal: (r: ByteReader) => r.readInt32(),
};

const Uint64Encoding: Encoding<number | bigint> = {
    marshal: (w: ByteWriter, value?: number | bigint) => w.writeUint64(value || 0),
    unmarshal: (r: ByteReader, td?: TypeDesignator<number | bigint>) => {
        const v = r.readUint64();
        return td === Number ? Number(v) : v;
    },
};

const Int64Encoding: Encoding<number | bigint> = {
    marshal: (w: ByteWriter, value?: number | bigint) => w.writeInt64(value || 0),
    unmarshal: (r: ByteReader, td?: TypeDesignator<number | bigint>) => {
        const v = r.readInt64();
        return td === Number ? Number(v) : v;
    },
};

const BigIntEncoding: Encoding<number | bigint> = {
    marshal: (w: ByteWriter, value?: number | bigint) => {
        let val = BigInt(value);
        const sign = val < 0;
        if (sign) {
            val = -val;
        }
        let i = 0;
        do {
            const bits = (i === 0) ? 6n : 7n;
            let byte = val & ((1n << bits) - 1n);
            val >>= bits;
            if (val) {
                byte |= 0x80n;
            }
            if (i === 0 && sign) {
                byte |= 0x40n;
            }
            w.writeUint8(byte);
            i++;
        } while (val);
    },
    unmarshal: (r: ByteReader, td?: TypeDesignator<number | bigint>) => {
        const buf: number[] = [];
        let byte: number;
        do {
            byte = r.readInt8();
            buf.push(byte);
        } while ((byte & 0x80) !== 0);
        let val = 0n;
        let sign = false;
        for (let i = buf.length - 1; i >= 0; i--) {
            const bits = (i === 0) ? 6n : 7n;
            const byte = BigInt(buf[i]);
            val <<= bits;
            val |= byte & ((1n << bits) - 1n);
            if (i === 0) {
                sign = !!(byte & 0x40n);
            }
        }
        if (sign) {
            val = -val;
        }
        return td === Number ? Number(val) : val;
    }
};

const BigUintEncoding: Encoding<number | bigint> = {
    marshal: (w: ByteWriter, value?: number | bigint) => {
        let val = BigInt(value);
        if (val < 0) {
            throw new Error("Value must be positive");
        }
        do {
            let tmp = val & 0x7fn;
            val >>= 7n;
            if (val) {
                tmp |= 0x80n;
            }
            w.writeUint8(tmp);
        } while (val);
    },
    unmarshal: (r: ByteReader, td?: TypeDesignator<number | bigint>) => {
        const buf: number[] = [];
        let byte: number;
        do {
            byte = r.readInt8();
            buf.push(byte);
        } while ((byte & 0x80) !== 0);
        let val = 0n;
        for (let i = buf.length - 1; i >= 0; i--) {
            const byte = BigInt(buf[i]);
            val <<= 7n;
            val |= byte & 0x7fn;
        }
        return td === Number ? Number(val) : val;
    }
};

const BooleanEncoding: Encoding<boolean> = {
    marshal: (w: ByteWriter, value?: boolean) => w.writeUint8(value ? 255 : 0),
    unmarshal: (r: ByteReader) => r.readUint8() ? true : false,
};

const BytesEncoding: Encoding<number[] | Uint8Array | Uint8ClampedArray> = {
    marshal: (w: ByteWriter, value?: number[] | Uint8Array | Uint8ClampedArray) => {
        if (!value || value.length === 0) {
            return;
        }
        if (Array.isArray(value) || value instanceof Uint8Array || value instanceof Uint8ClampedArray) {
            w.writeBytes(value);
            return;
        }
        throw new Error(`Wrong input value type for bytes encoding: ${value}`);
    },
    unmarshal: (r: ByteReader, td?: TypeDesignator<number[] | Uint8Array | Uint8ClampedArray>) => {
        let bytes = r.readBytes();
        if (bytes === null) {
            bytes = new Uint8Array();
        }
        if (td === undefined || td === Uint8Array) {
            return bytes;
        } else if (td === Uint8ClampedArray) {
            return new Uint8ClampedArray(bytes);
        } else if (td === Array) {
            return Array.from(bytes);
        }
        throw new Error(`Wrong output type for bytes encoding: ${td}`);
    },
};

const StringEncoding: Encoding<string> = {
    marshal: (w: ByteWriter, value?: string) => {
        if (!value || value.length === 0) {
            return;
        }
        if (typeof value === "string") {
            const utf8enc = new TextEncoder();
            w.writeBytes(utf8enc.encode(value));
            return;
        }
        throw new Error(`Value must be a string: ${value}`);
    },
    unmarshal: (r: ByteReader) => {
        const bytes = r.readBytes();
        if (bytes === null) {
            return "";
        }
        const utf8dec = new TextDecoder();
        return utf8dec.decode(bytes);
    },
};

/**
 * Returns default encoding for primitive type or undefined
 * @param ctor A type designator
 */
export function defaultEncoding<T>(ctor: TypeDesignator<T>): Encoding<T> | undefined {
    let ret: Encoding | undefined;
    switch (<TypeDesignator>ctor) {
        case Number:
            ret = Int32Encoding;

        case BigInt:
            ret = BigIntEncoding;

        case Boolean:
            ret = BooleanEncoding;

        case String:
            ret = StringEncoding;

        case Uint8Array:
        case Uint8ClampedArray:
            ret = BytesEncoding;
    }
    return <Encoding<T> | undefined>ret;
}

// Class decorators

/**
 * Class annotated with this decorator will be deserialized by passing a reader instance into its constructor.
 * See also {@link marshallable}
 * @param target A class constructor
 * ```typescript
 * @unmarshallable
 * class CustomEncoding {
 *     constructor(r: ByteReader) {
 *         // ...
 *     }
 * }
 * ```
 * @category Decorator
 */
export function unmarshallable(target: Unmarshallable<unknown>) {
    Reflect.defineMetadata("data-encoding:unmarshallable", true, target);
}

/**
 * Class annotated with this decorator will be serialized using its {@link Marshallable} interface.
 * See also {@link unmarshallable}
 * @param target A class constructor
 * ```typescript
 * @marshallable
 * class CustomEncoding implements Marshallable {
 *     marshal(w: ByteWriter) {
 *         // ...
 *     }
 * }
 * ```
 * @category Decorator
 */
export function marshallable(target: new () => Marshallable) {
    Reflect.defineMetadata("data-encoding:marshallable", true, target);
}

// Property decorators
function defineProperty(target: object, targetKey: string | symbol) {
    let pmap: Map<string | symbol, boolean> = Reflect.getMetadata("data-encoding:properties", target);
    if (pmap === undefined) {
        pmap = new Map<string | symbol, boolean>();
        Reflect.defineMetadata("data-encoding:properties", pmap, target);
    }
    pmap.set(targetKey, true);
}

export type EncodingFactory = (next?: Encoding) => Encoding;

/**
 * A low level function. Add encoding to the chain stored in target's metadata.
 */
export function defineEncoding(factory: EncodingFactory, target: object, targetKey?: string | symbol) {
    let enc: Encoding | undefined;
    if (targetKey !== undefined) {
        defineProperty(target, targetKey);
        enc = Reflect.getMetadata("data-encoding:encoding", target, targetKey);
    } else {
        enc = Reflect.getMetadata("data-encoding:encoding", target);
    }
    enc = factory(enc);
    if (targetKey !== undefined) {
        Reflect.defineMetadata("data-encoding:encoding", enc, target, targetKey);
    } else {
        Reflect.defineMetadata("data-encoding:encoding", enc, target);
    }
}

// Bind the property type
type Decorator<T> = <TT extends { [key in KT]?: T }, KT extends string | symbol>(target: TT, targetKey: KT) => void;

interface AtomicDecorator<T = any> extends Decorator<T> {
    __atomicPropertyType: T;
}

/**
 * An encoding may be referred by {@link Encoding} interface or by atomic type decorator function (see examples).
 */
type EncodingDesignator<T = any> = (T extends bigint ? AtomicDecorator<T | number> : AtomicDecorator<T>) | Encoding<T>;

function defineAtomic<T>(e: Encoding<T>): AtomicDecorator<T> {
    const ret: Decorator<T> = <TT extends { [key in KT]?: T }, KT extends string | symbol>(target: TT, targetKey: KT) => defineEncoding(() => e, target, targetKey);
    return <AtomicDecorator<T>>ret;
}

/**
 * Use default encoding for a property of a primitive type
 */
export const auto = (target: object, targetKey: string | symbol) => defineProperty(target, targetKey);
/**
 * Encode a numeric property as Uint8
 *
 * ```typescript
 * class T {
 *     @uint8 prop?: number;
 * }
 * ```
 *
 * | Contents | Size |
 * | -------- | ---- |
 * | Value    | 1    |
 *
 * @category Decorator
 */
export const uint8 = defineAtomic(Uint8Encoding);
/**
 * Encode a numeric property as Int8
 *
 * ```typescript
 * class T {
 *     @int8 prop?: number;
 * }
 * ```
 *
 * | Contents | Size |
 * | -------- | ---- |
 * | Value    | 1    |
 *
 * @category Decorator
 */
export const int8 = defineAtomic(Int8Encoding);
/**
 * Encode a numeric property as Uint16
 *
 * ```typescript
 * class T {
 *     @uint16 prop?: number;
 * }
 * ```
 *
 * | Contents | Size |
 * | -------- | ---- |
 * | Value    | 2    |
 *
 * @category Decorator
 */
export const uint16 = defineAtomic(Uint16Encoding);
/**
 * Encode a numeric property as Int16
 *
 * ```typescript
 * class T {
 *     @int16 prop?: number;
 * }
 * ```
 *
 * | Contents | Size |
 * | -------- | ---- |
 * | Value    | 2    |
 *
 * @category Decorator
 */
export const int16 = defineAtomic(Int16Encoding);
/**
 * Encode a numeric property as Uint32
 *
 * ```typescript
 * class T {
 *     @uint32 prop?: number;
 * }
 * ```
 *
 * | Contents | Size |
 * | -------- | ---- |
 * | Value    | 4    |
 *
 * @category Decorator
 */
export const uint32 = defineAtomic(Uint32Encoding);
/**
 * Encode a numeric property as Int32
 *
 * ```typescript
 * class T {
 *     @int32 prop?: number;
 * }
 * ```
 *
 * | Contents | Size |
 * | -------- | ---- |
 * | Value    | 4    |
 *
 * @category Decorator
 */
export const int32 = defineAtomic(Int32Encoding);
/**
 * Encode a numeric property as Uint64
 *
 * ```typescript
 * class T {
 *     @uint64 prop0?: bigint;
 *     @uint64 prop1?: number; // Also works
 * }
 * ```
 *
 * | Contents | Size |
 * | -------- | ---- |
 * | prop0    | 8    |
 * | prop1    | 8    |
 *
 * @category Decorator
 */
export const uint64 = defineAtomic(Uint64Encoding);
/**
 * Encode a numeric property as Int64
 *
 * ```typescript
 * class T {
 *     @int64 prop0?: bigint;
 *     @int64 prop1?: number; // Also works
 * }
 * ```
 *
 * | Contents | Size |
 * | -------- | ---- |
 * | prop0    | 8    |
 * | prop1    | 8    |
 *
 * @category Decorator
 */
export const int64 = defineAtomic(Int64Encoding);
/**
 * Encode a string property as UTF-8 byte series.
 * By default string will occupy the whole rest of the parent object.
 * Usually should be wrapped with {@link variable} or {@link fixed} encoding.
 *
 * ```typescript
 * class T {
 *     @variable @str prop?: string;
 * }
 * ```
 *
 * | Contents | Size |
 * | -------- | ---- |
 * | Length | 4 |
 * | Value | Variable |
 *
 * @category Decorator
 */
export const str = defineAtomic(StringEncoding);
/**
 * Encode a numeric array as a byte series
 * By default byte array will occupy the whole rest of the parent object.
 * Usually should be wrapped with {@link variable} or {@link fixed} encoding.
 *
 * ```typescript
 * class T {
 *     @variable @bytes prop0?: number[];
 *     @variable @bytes prop1?: Uint8Array; // Also works
 * }
 * ```
 *
 * | Contents | Size |
 * | -------- | ---- |
 * | prop0 length | 4 |
 * | prop0 value | Variable |
 * | prop1 length | 4 |
 * | prop1 value | Variable |
 *
 * @category Decorator
 */
export const bytes = defineAtomic(BytesEncoding);
/**
 * Encode a bigint property using unary encoding.
 * The encoding contains end marker and usually should _not_ be wrapped with {@link variable} or {@link fixed}
 * ```typescript
 * class T {
 *     @bigInt prop?: bigint;
 * }
 * ```
 *
 * | Contents | Size |
 * | -------- | ---- |
 * | Value | Variable |
 *
 * @category Decorator
 */
export const bigInt = defineAtomic(BigIntEncoding);
/**
 * Encode a bigint property using unary encoding.
 * The encoding contains end marker and usually should _not_ be wrapped with {@link variable} or {@link fixed}
 *
 * ```typescript
 * class T {
 *     @bigUint prop?: bigint;
 * }
 * ```
 *
 * | Contents | Size |
 * | -------- | ---- |
 * | Value | Variable |
 *
 * @category Decorator
 */
export const bigUint = defineAtomic(BigUintEncoding);

const atomics = new Map<AtomicDecorator, Encoding>([
    [uint8, Uint8Encoding],
    [int8, Int8Encoding],
    [uint16, Uint16Encoding],
    [int16, Int16Encoding],
    [uint32, Uint32Encoding],
    [int32, Int32Encoding],
    [uint64, Uint64Encoding],
    [int64, Int64Encoding],
    [str, StringEncoding],
    [bytes, BytesEncoding],
    [bigInt, BigIntEncoding],
    [bigUint, BigUintEncoding],
]);

function getEncoding<T>(e: EncodingDesignator<T>): Encoding<T> {
    if (typeof e === "function") {
        const tmp = atomics.get(e);
        if (tmp === undefined) {
            throw new Error(`Unknown encoding ${e}`);
        }
        return <Encoding<T>>tmp;
    }
    return e;
}

/**
 * Declare an array of identically typed elements.
 * This is mandatory for array like properties since the element type is missing from the TypeScript runtime type information.
 * @typeParam T An element type.
 * @param td An element type designator.
 * @param e An optional encoding to be applied to every item.
 *
 * ### Example 1
 * ```typescript
 * class T {
 *     @variable @elem<number>(Number, uint32) prop?: number[];
 * }
 * ```
 *
 * | Contents | Size |
 * | -------- | ---- |
 * | Length | 4 |
 * | Sequence of 4 byte elements | Variable |
 *
 * ### Example 2
 * ```typescript
 * class T {
 *     @variable @elem<bigint>(BigInt, uint64) prop?: bigint[];
 * }
 * ```
 *
 * | Contents | Size |
 * | -------- | ---- |
 * | Length | 4 |
 * | Sequence of 8 byte elements | Variable |
 *
 * ### Example 3
 * ```typescript
 * class T {
 *     @variable @elem(VarString) prop?: VarString[];
 * }
 * ```
 *
 * | Contents | Size |
 * | -------- | ---- |
 * | Length | 4 |
 * | Sequence of {@link VarString} | Variable |
 *
 * @category Decorator
 */
export function elem<T>(td: TypeDesignator<T>, e?: EncodingDesignator<T>): <TT extends { [key in KT]?: T[] }, KT extends string | symbol>(target: TT, targetKey: KT) => void {
    let enc: Encoding<T> | undefined;
    if (e !== undefined) {
        enc = getEncoding(e);
    }

    return <TT extends { [key in KT]?: T[] }, KT extends string | symbol>(target: TT, targetKey: KT) => {
        const factory = () => {
            return {
                marshal: (w: ByteWriter, value?: T[]) => {
                    if (!value) {
                        return;
                    }
                    if (enc !== undefined) {
                        for (const v of value) {
                            enc.marshal(w, v);
                        }
                    } else {
                        const enc = new Encoder(w);
                        for (const v of value) {
                            enc.marshal(v);
                        }
                    }
                },
                unmarshal: (r: ByteReader) => {
                    const ret: T[] = [];
                    if (enc !== undefined) {
                        while (r.length !== 0) {
                            ret.push(enc.unmarshal(r, td));
                        }
                    } else {
                        const dec = new Decoder(r);
                        while (r.length !== 0) {
                            ret.push(dec.unmarshal(td));
                        }
                    }
                    return ret;
                },
            };
        };
        defineEncoding(factory, target, targetKey);
    };
}

function indexEncoding(codes: Iterable<number>): EncodingDesignator<number> {
    let maxv = 0;
    for (const v of codes) {
        if (v > maxv) {
            maxv = v;
        }
    }
    if (maxv <= 0xff) {
        return uint8;
    } else if (maxv <= 0xffff) {
        return uint16;
    } else {
        return uint32;
    }
}

/**
 * Union aka variant encoding. Numeric tag goes first followed by the actual data.
 * @typeParam T Property type. Usually a union type (`A | B | ...`).
 * @param u Type to tag mapping table.
 * @param enc Numeric encoding to be used for tag record. Will be chosen automatically is omitted.
 *
 * ```typescript
 * class T1 {
 *     // ...
 * }
 *
 * class T2 {
 *     // ...
 * }
 *
 * class UnionObject {
 *     @union<T1 | T2 | number>([
 *         [T1, 0],
 *         [T2, 1],
 *         [Number, [2, uint32]], // Atomic types are allowed too if they are unambiguous (type identifiers must be unique).
 *     ])
 *     prop?: T1 | T2 | number;
 * }
 * ```
 *
 * | Contents | Size |
 * | -------- | ---- |
 * | Tag | 1 |
 * | Data | Variable |
 *
 * @category Decorator
 */
export function union<T>(u: Iterable<readonly [TypeDesignator<T>, number | [number, EncodingDesignator]]>, enc?: EncodingDesignator<number>): <TT extends { [key in KT]?: T }, KT extends string | symbol>(target: TT, targetKey: KT) => void {
    const tags = new Map<TypeDesignator<T>, number | [number, Encoding]>((function* (): Iterable<[TypeDesignator<T>, number | [number, Encoding]]> {
        for (const [k, v] of u) {
            yield [k, Array.isArray(v) ? [v[0], getEncoding(v[1])] : v];
        }
    })());

    if (enc === undefined) {
        enc = indexEncoding((function* () {
            for (const [, v] of u) {
                yield Array.isArray(v) ? v[0] : v;
            }
        })());
    }
    const tagEnc = getEncoding(enc);

    return (target: object, targetKey: string | symbol) => {
        const factory = () => {
            return {
                marshal: (w: ByteWriter, value: Object) => {
                    const v = tags.get(<TypeDesignator<T>>value.constructor);
                    if (v === undefined) {
                        throw new Error(`Unknown value for union type: ${value}`);
                    }
                    const [tag, elemEnc] = Array.isArray(v) ? v : [v];
                    tagEnc.marshal(w, tag);
                    if (elemEnc !== undefined) {
                        elemEnc.marshal(w, value);
                    } else {
                        const enc = new Encoder(w);
                        enc.marshal(value);
                    }
                },
                unmarshal: (r: ByteReader) => {
                    const tag = tagEnc.unmarshal(r);
                    for (const [td, v] of tags) {
                        const [t, elemEnc] = Array.isArray(v) ? v : [v];
                        if (t === tag) {
                            if (elemEnc !== undefined) {
                                return elemEnc.unmarshal(r, td);
                            } else {
                                const dec = new Decoder(r);
                                return dec.unmarshal(td);
                            }
                        }
                    }
                    throw new Error(`Unknown tag: ${tag}`);
                },
            };
        };
        defineEncoding(factory, target, targetKey);
    };
}

/**
 * String enum encoding.
 * @param en String constants to codes mapping table
 * @param enc Numeric encoding to be used for code. Will be chosen automatically is omitted.
 *
 * ```typescript
 * class Color {
 *     @strEnum([
 *         ["red", 0],
 *         ["green", 1],
 *         ["blue", 2],
 *     ]) prop: "red" | "green" | "blue";
 * }
 * ```
 *
 * | Contents | Size |
 * | -------- | ---- |
 * | Value | 1 |
 *
 * @category Decorator
 */
export function strEnum<T extends string>(en: Iterable<readonly [T, number]>, enc?: EncodingDesignator<number>): <TT extends { [key in KT]?: T }, KT extends string | symbol>(target: TT, targetKey: KT) => void {
    const codes = new Map<string, number>(en);
    if (enc === undefined) {
        enc = indexEncoding(codes.values());
    }
    const codeEnc = getEncoding(enc);

    return <TT extends { [key in KT]?: T }, KT extends string | symbol>(target: TT, targetKey: KT) => {
        const factory = () => {
            return {
                marshal: (w: ByteWriter, value: string) => {
                    const code = codes.get(value);
                    if (code === undefined) {
                        throw new Error(`Unknown value for string enum type: ${value}`);
                    }
                    codeEnc.marshal(w, code);
                },
                unmarshal: (r: ByteReader) => {
                    const code = codeEnc.unmarshal(r);
                    for (const [str, c] of codes) {
                        if (c === code) {
                            return str;
                        }
                    }
                    throw new Error(`Unknown string enum value: ${code}`);
                },
            };
        };
        defineEncoding(factory, target, targetKey);
    };
}

// Modifiers

/**
 * Prefix object's data with 32 bit record containing its size. Can be used for properties as well as whole objects.
 * ### Example 1
 * ```typescript
 * class T1 {
 *     @variable @str str?: string;
 *     @uint64 num?: bigint;
 * }
 * ```
 *
 * | Contents | Size |
 * | -------- | ---- |
 * | str length | 4 |
 * | str data | Variable |
 * | num | 8 |
 *
 * ### Example 2
 * ```typescript
 * @variable
 * class T2 {
 *     @variable @str str?: string;
 *     @uint32 num?: number;
 * }
 * ```
 *
 * | Contents | Size |
 * | -------- | ---- |
 * | Total size of the following data | 4 |
 * | str length | 4 |
 * | str data | Variable |
 * | num | 4 |
 *
 * @category Decorator
 */
export function variable(target: object, targetKey?: string | symbol) {
    const factory = (next?: Encoding) => {
        return {
            marshal: (w: ByteWriter, value?: Object) => {
                const writer = new Writer();
                if (value !== undefined) {
                    if (next !== undefined) {
                        next.marshal(writer, value);
                    } else {
                        const enc = new Encoder(writer);
                        enc.marshalObject(value);
                    }
                }
                const bytes = writer.bytes;
                w.writeUint32(bytes.length);
                w.writeBytes(bytes);
            },
            unmarshal: (r: ByteReader, td?: TypeDesignator) => {
                const len = r.readUint32();
                const rd = r.reader(len);
                if (len !== rd.length) {
                    throw new Error(`Short read: ${len} bytes expected, got ${rd.length}`);
                }
                if (next !== undefined) {
                    return next.unmarshal(rd, td);
                } else {
                    const dec = new Decoder(rd);
                    if (td === undefined) {
                        throw new Error("Undefined destination type");
                    }
                    return dec.unmarshalObject(td);
                }
            },
        };
    };
    defineEncoding(factory, target, targetKey);
}

/**
 * Always use specified amount of bytes for the object. Object's data will be truncated or padded by zeroes.
 * Due to possible truncation it's usually unsafe to use this modifier with types other than strings and byte arrays.
 * @param len A byte length
 *
 * ```typescript
 * class T {
 *     @fixed(64) @str str?: string;
 * }
 * ```
 *
 * | Contents | Size |
 * | -------- | ---- |
 * | Zero padded string | 64 |
 *
 * @category Decorator
 */
export function fixed(len: number): (target: object, targetKey?: string | symbol) => void {
    return (target: object, targetKey?: string | symbol) => {
        const factory = (next?: Encoding) => {
            return {
                marshal: (w: ByteWriter, value?: Object) => {
                    const writer = new Writer();
                    if (value !== undefined) {
                        if (next !== undefined) {
                            next.marshal(writer, value);
                        } else {
                            const enc = new Encoder(writer);
                            enc.marshalObject(value);
                        }
                    }
                    const bytes = writer.bytes;
                    const wr = bytes.length < len ? bytes : bytes.slice(0, len);
                    w.writeBytes(wr);
                    if (wr.length < len) {
                        w.writeBytes(new Uint8Array(len - wr.length));
                    }
                },
                unmarshal: (r: ByteReader, td?: TypeDesignator) => {
                    const rd = r.reader(len);
                    if (len !== rd.length) {
                        throw new Error(`Short read: ${len} bytes expected, got ${rd.length}`);
                    }
                    if (next !== undefined) {
                        return next.unmarshal(rd, td);
                    } else {
                        const dec = new Decoder(rd);
                        if (td === undefined) {
                            throw new Error("Undefined destination type");
                        }
                        return dec.unmarshalObject(td);
                    }
                },
            };
        };
        defineEncoding(factory, target, targetKey);
    };
}

/**
 * An optional property. The first byte indicates the presence of the following data.
 * Property is considered missing if it's undefined or null.
 *
 * ```typescript
 * export class T {
 *     @optional @uint64 num?: bigint;
 * }
 * ```
 *
 * ### num === undefined
 * | Contents | Size |
 * | -------- | ---- |
 * | 0 | 1 |
 *
 * ### num !== undefined
 * | Contents | Size |
 * | -------- | ---- |
 * | 255 | 1 |
 * | num | 8 |
 *
 * @category Decorator
 */
export function optional(target: object, targetKey: string | symbol) {
    const factory = (next?: Encoding) => {
        return {
            marshal: (w: ByteWriter, value?: Object) => {
                if (value !== null && value !== undefined) {
                    w.writeUint8(255);
                    if (next !== undefined) {
                        next.marshal(w, value);
                    } else {
                        const enc = new Encoder(w);
                        enc.marshalObject(value);
                    }
                } else {
                    w.writeUint8(0);
                }
            },
            unmarshal: (r: ByteReader, td?: TypeDesignator) => {
                const flag = r.readUint8();
                if (flag === 0) {
                    return;
                }
                if (next !== undefined) {
                    return next.unmarshal(r, td);
                } else {
                    if (td === undefined) {
                        throw new Error("Undefined destination type");
                    }
                    const dec = new Decoder(r);
                    return dec.unmarshalObject(td);
                }
            },
        };
    };
    defineEncoding(factory, target, targetKey);
}
