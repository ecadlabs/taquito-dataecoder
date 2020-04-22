import { defaultEncoding } from "./encoding";
import { Encoding, ByteWriter, Marshallable, TypeDesignator, Constructor } from "./types";
import "reflect-metadata";

/**
 * Serialize objects into Tezos binary encoding using given writer instance.
 *
 * ```typescript
 * import { Writer, Encoder } from "data-encoding";
 *
 * class T {
 *     // ...
 * }
 *
 * // ...
 * const inst = new T();
 * // ...
 * const w = new Writer();
 * new Encoder(w).marshal(inst);
 * // Use w.bytes
 * ```
 */
export class Encoder {
    constructor(private w: ByteWriter) {
    }

    private encodeProperty(obj: Object, prop: string | symbol) {
        let val: Object | undefined = (<any>obj)[prop];
        let enc: Encoding | undefined = Reflect.getMetadata("data-encoding:encoding", obj, prop);
        if (enc !== undefined) {
            // Use encoder
            enc.marshal(this.w, val);
            return;
        }

        let td: TypeDesignator = Reflect.getMetadata("design:type", obj, prop);
        if (td === undefined) {
            /* istanbul ignore next */
            if (!val) {
                // Need to switch `emitDecoratorMetadata` off to test
                throw new Error(`Encoding for property ${String(prop)} is not defined`);
            }
            td = <TypeDesignator>val.constructor;
        }

        // Guess encoding for atomic types
        enc = defaultEncoding(td);
        if (enc !== undefined) {
            // Use encoder
            enc.marshal(this.w, val);
            return;
        }

        // We have type info but no encoding
        if (val === undefined || val === null) {
            // Try to construct it
            try {
                val = new (<Constructor<Object>>td)();
            } catch (e) {
                /* istanbul ignore next */
                if (!(e instanceof TypeError)) {
                    throw (e);
                }
                // Skip
                /* istanbul ignore next */
                return;
            }
        }
        this.marshal(val);
    }

    /**
     * A highest level encoding function. Serializes an object using writer instance used in construction.
     * Uses {@link Encoder.marshalObject} internally.
     * @param obj An object instance to serialize
     */
    marshal(obj: Object) {
        const enc: Encoding | undefined = Reflect.getMetadata("data-encoding:encoding", obj.constructor);
        if (enc !== undefined) {
            // Use encoder
            enc.marshal(this.w, obj);
            return;
        }
        this.marshalObject(obj);
    }

    /**
     * The same as {@link Encoder.marshal} but ignores class-level encoding information.
     * Used in container encodings as a recursion entry point.
     * @param obj An object instance to serialize
     */
    marshalObject(obj: Object) {
        if (Reflect.getMetadata("data-encoding:marshallable", obj.constructor)) {
            (<Marshallable>obj).marshal(this.w);
            return;
        }

        // Guess encoding for atomic types
        const enc = defaultEncoding(<TypeDesignator>obj.constructor);
        if (enc !== undefined) {
            // Use encoder
            enc.marshal(this.w, obj);
            return;
        }

        if (obj instanceof Map || Array.isArray(obj)) {
            for (const v of (obj instanceof Map ? obj.values() : obj)) {
                this.marshal(v);
            }
            return;
        }

        // Traverse object
        const pmap: Map<string | symbol, boolean> = Reflect.getMetadata("data-encoding:properties", obj);
        for (const prop of pmap !== undefined ? pmap.keys() : Object.keys(obj)) {
            this.encodeProperty(obj, prop);
        }
    }
}