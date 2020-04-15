import { ByteReader, TypeDesignator, Unmarshallable, Constructor, Encoding } from "./types";
import { defaultEncoding } from "./encoding";
import "reflect-metadata";

function isTypeDesignator<T>(arg: TypeDesignator<T> | T): arg is TypeDesignator<T> {
    return typeof arg === "function";
}

/**
 * Deserialize Tezos binary encoding using a given reader instance.
 * ```typescript
 * import { Reader, Decoder } from "data-encoding";
 *
 * class T {
 *     // ...
 * }
 *
 * // ...
 * // Get a byte array
 * const r = new Reader(bytes);
 * const res = new Decoder(r).unmarshal(T);
 * ```
 */
export class Decoder {
    constructor(private r: ByteReader) {
    }

    private decodeProperty(obj: Object, prop: string | symbol): unknown {
        const val: Object | undefined = (<any>obj)[prop];
        let td: TypeDesignator = Reflect.getMetadata("design:type", obj, prop);
        if (td === undefined) {
            if (!val) {
                throw new Error(`Encoding for property ${String(prop)} is not defined`);
            }
            td = <TypeDesignator>val.constructor;
        }

        let enc: Encoding | undefined = Reflect.getMetadata("data-encoding:encoding", obj, prop);
        if (enc !== undefined) {
            return enc.unmarshal(this.r, td);
        }

        // Guess encoding for atomic types
        enc = defaultEncoding(td);
        if (enc !== undefined) {
            return enc.unmarshal(this.r, td);
        }

        if (val !== undefined) {
            return this.unmarshal(td);
        }
        return;
    }

    /**
     * A highest level decoding function. Returns a newly decoded object with a given type designator.
     * Uses {@link Decoder.unmarshalObject} internally.
     * @param destType An output type constructor or an instance of array-like object
     */
    unmarshal<T>(destType: TypeDesignator<T> | T): T {
        if (isTypeDesignator(destType)) {
            const enc: Encoding<T> | undefined = Reflect.getMetadata("data-encoding:encoding", destType);
            if (enc !== undefined) {
                // Use encoder
                return enc.unmarshal(this.r, destType);
            }
        }
        return this.unmarshalObject(destType);
    }

    /**
     * The same as {@link Decoder.unmarshal} but ignores class-level encoding information.
     * Used in container encodings as a recursion entry point.
     * @param destType An output type constructor or an instance of array-like object
     */
    unmarshalObject<T>(destType: TypeDesignator<T> | T): T {
        let obj: T;
        if (isTypeDesignator(destType)) {
            if (Reflect.getMetadata("data-encoding:unmarshallable", destType)) {
                return new (<Unmarshallable<T>>destType)(this.r);
            }

            // Guess encoding for atomic types
            const enc = defaultEncoding(destType);
            if (enc !== undefined) {
                return enc.unmarshal(this.r);
            }
            obj = new (<Constructor<T>>destType)();
        } else {
            obj = destType;
            if (Array.isArray(obj)) {
                // Keep array length and element types
                for (let i = 0; i < obj.length; i++) {
                    const td = <TypeDesignator>obj[i].constructor;
                    obj[i] = this.unmarshal(td);
                }
                return obj;
            }
        }

        // Traverse object
        const pmap: Map<string | symbol, boolean> = Reflect.getMetadata("data-encoding:properties", obj);
        for (const prop of pmap !== undefined ? pmap.keys() : Object.keys(obj)) {
            const v = this.decodeProperty(obj, prop);
            if (v !== undefined) {
                (<any>obj)[prop] = v;
            }
        }
        return obj;
    }
}
