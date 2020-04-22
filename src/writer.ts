import { ByteWriter, LiteArray } from "./types";

/**
 * Handles the byte stream endianness.
 */
export class Writer implements ByteWriter {
    private buffer: number[] = [];

    get bytes(): Uint8Array {
        return new Uint8Array(this.buffer);
    }

    get length(): number {
        return this.buffer.length;
    }

    writeBytes(val: LiteArray<number>) {
        this.buffer.push(...val.map(v => v & 0xff));
    }

    writeUint8(val: number | bigint) {
        const v = Number(val) | 0;
        this.buffer.push(v & 0xff);
    }

    writeUint16(val: number | bigint) {
        const v = Number(val) | 0;
        this.buffer.push((v >> 8) & 0xff);
        this.buffer.push(v & 0xff);
    }

    writeUint32(val: number | bigint) {
        const v = Number(val) | 0;
        this.buffer.push((v >> 24) & 0xff);
        this.buffer.push((v >> 16) & 0xff);
        this.buffer.push((v >> 8) & 0xff);
        this.buffer.push(v & 0xff);
    }

    writeUint64(val: number | bigint) {
        const v = BigInt(val);
        this.buffer.push(Number(BigInt.asUintN(8, v >> 56n)) | 0);
        this.buffer.push(Number(BigInt.asUintN(8, v >> 48n)) | 0);
        this.buffer.push(Number(BigInt.asUintN(8, v >> 40n)) | 0);
        this.buffer.push(Number(BigInt.asUintN(8, v >> 32n)) | 0);
        this.buffer.push(Number(BigInt.asUintN(8, v >> 24n)) | 0);
        this.buffer.push(Number(BigInt.asUintN(8, v >> 16n)) | 0);
        this.buffer.push(Number(BigInt.asUintN(8, v >> 8n)) | 0);
        this.buffer.push(Number(BigInt.asUintN(8, v)) | 0);
    }

    writeInt8(val: number | bigint) {
        this.writeUint8(val);
    }

    writeInt16(val: number | bigint) {
        this.writeUint16(val);
    }

    writeInt32(val: number | bigint) {
        this.writeUint32(val);
    }

    writeInt64(val: number | bigint) {
        this.writeUint64(val);
    }
}

