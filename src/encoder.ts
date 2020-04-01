import { defaultEncoding } from "./encoding";
import { Encoding, ByteWriter, Marshallable, TypeDesignator, Constructor } from "./types";
import "reflect-metadata";

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
            if (!val) {
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
        if (!val) {
            if (td === Array || td === Map || td === Object) {
                return;
            } else if (td === BigInt) {
                val = BigInt(0);
            } else {
                // Try to construct it
                try {
                    val = new (<Constructor<Object>>td)();
                } catch (e) {
                    if (!(e instanceof TypeError)) {
                        throw (e);
                    }
                    // Skip
                    return;
                }
            }
        }
        this.marshal(val);
    }

    marshal(obj: Object) {
        const enc: Encoding | undefined = Reflect.getMetadata("data-encoding:encoding", obj.constructor);
        if (enc !== undefined) {
            // Use encoder
            enc.marshal(this.w, obj);
            return;
        }
        this.marshalObject(obj);
    }

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