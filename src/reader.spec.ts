import "jest-extended";
import { Reader } from "./reader";

describe("Reader", () => {
    it("short read: uint8", () => {
        const r = new Reader(new Uint8Array());
        expect(() => r.readUint8()).toThrow();
    });
    it("short read: int8", () => {
        const r = new Reader(new Uint8Array());
        expect(() => r.readInt8()).toThrow();
    });
    it("short read: uint16", () => {
        const r = new Reader(new Uint8Array());
        expect(() => r.readUint16()).toThrow();
    });
    it("short read: int16", () => {
        const r = new Reader(new Uint8Array());
        expect(() => r.readInt16()).toThrow();
    });
    it("short read: uint32", () => {
        const r = new Reader(new Uint8Array());
        expect(() => r.readUint32()).toThrow();
    });
    it("short read: int32", () => {
        const r = new Reader(new Uint8Array());
        expect(() => r.readInt32()).toThrow();
    });
    it("short read: uint64", () => {
        const r = new Reader(new Uint8Array());
        expect(() => r.readUint64()).toThrow();
    });
    it("short read: int64", () => {
        const r = new Reader(new Uint8Array());
        expect(() => r.readInt64()).toThrow();
    });
    it("short read: bytes: empty", () => {
        const r = new Reader(new Uint8Array());
        expect(r.readBytes(10)).toBe(null);
    });
    it("short read: bytes", () => {
        const r = new Reader(new Uint8Array([0]));
        const result = r.readBytes(10);
        expect(result).toBeInstanceOf(Uint8Array);
        if (result) {
            expect(result.length).toBe(1);
        }
    });
    it("read: bytes", () => {
        const r = new Reader(new Uint8Array([0, 0, 0, 0]));
        const result = r.readBytes(4);
        expect(result).toBeInstanceOf(Uint8Array);
        if (result) {
            expect(result.length).toBe(4);
        }
    });
});
