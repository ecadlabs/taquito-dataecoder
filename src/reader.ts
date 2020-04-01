import { ByteReader } from "./types";

const boundsErr = new Error("bounds out of range");

export class Reader implements ByteReader {
    constructor(private buffer: Uint8Array, private idx: number = 0, private cap: number = buffer.length) {
    }

    get length(): number {
        return this.cap - this.idx;
    }

    bytes(): Uint8Array {
        return this.buffer.slice(this.idx);
    }

    readBytes(len?: number): Uint8Array | null {
        const rem = this.cap - this.idx;
        if (len === undefined || len > rem) {
            len = rem;
        }
        const ret = len > 0 ? this.buffer.slice(this.idx, this.idx + len) : null;
        this.idx += len;
        return ret;
    }

    reader(len?: number): Reader {
        const rem = this.cap - this.idx;
        if (len === undefined || len > rem) {
            len = rem;
        }
        const ret = new Reader(this.buffer, this.idx, this.idx + len);
        this.idx += len;
        return ret;
    }

    readUint8(): number {
        if (this.cap - this.idx < 1) {
            throw boundsErr;
        }
        return this.buffer[this.idx++] >>> 0;
    }

    readUint16(): number {
        if (this.cap - this.idx < 2) {
            throw boundsErr;
        }
        const x0 = this.buffer[this.idx++];
        const x1 = this.buffer[this.idx++];
        return ((x0 << 8) | x1) >>> 0;
    }

    readUint32(): number {
        if (this.cap - this.idx < 4) {
            throw boundsErr;
        }
        const x0 = this.buffer[this.idx++];
        const x1 = this.buffer[this.idx++];
        const x2 = this.buffer[this.idx++];
        const x3 = this.buffer[this.idx++];
        return ((x0 << 24) | (x1 << 16) | (x2 << 8) | x3) >>> 0;
    }

    readUint64(): bigint {
        if (this.cap - this.idx < 8) {
            throw boundsErr;
        }
        const x0 = BigInt(this.buffer[this.idx++]);
        const x1 = BigInt(this.buffer[this.idx++]);
        const x2 = BigInt(this.buffer[this.idx++]);
        const x3 = BigInt(this.buffer[this.idx++]);
        const x4 = BigInt(this.buffer[this.idx++]);
        const x5 = BigInt(this.buffer[this.idx++]);
        const x6 = BigInt(this.buffer[this.idx++]);
        const x7 = BigInt(this.buffer[this.idx++]);
        return (x0 << 56n) | (x1 << 48n) | (x2 << 40n) | (x3 << 32n) |
            (x4 << 24n) | (x5 << 16n) | (x6 << 8n) | x7;
    }

    readInt8(): number {
        if (this.cap - this.idx < 1) {
            throw boundsErr;
        }
        const x = this.buffer[this.idx++];
        return (x << 24) >> 24;
    }

    readInt16(): number {
        if (this.cap - this.idx < 2) {
            throw boundsErr;
        }
        const x0 = this.buffer[this.idx++];
        const x1 = this.buffer[this.idx++];
        return (((x0 << 8) | x1) << 16) >> 16;
    }

    readInt32(): number {
        if (this.cap - this.idx < 4) {
            throw boundsErr;
        }
        const x0 = this.buffer[this.idx++];
        const x1 = this.buffer[this.idx++];
        const x2 = this.buffer[this.idx++];
        const x3 = this.buffer[this.idx++];
        return (x0 << 24) | (x1 << 16) | (x2 << 8) | x3;
    }

    readInt64(): bigint {
        const x = this.readUint64();
        const m = 0x8000000000000000n;
        if (x & m) {
            return (x ^ m) - m;
        } else {
            return x;
        }
    }
}