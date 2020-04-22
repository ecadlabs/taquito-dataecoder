import { uint8, int8, uint16, int16, uint32, int32, uint64, bigUint, bigInt, str, bytes, elem, strEnum, union, variable, fixed, optional, int64, bool, marshallable, unmarshallable, auto } from "./encoding";
import { Writer } from "./writer";
import { Reader } from "./reader";
import { Encoder } from "./encoder";
import { Decoder } from "./decoder";
import { VarString } from "./helpers";
import { ByteReader, ByteWriter, Marshallable, Encoding } from "./types";
import "jest-extended";

class Uint8Test {
    @uint8 prop?: number;
    constructor(v?: number) { if (v !== undefined) this.prop = v; }
}

class Int8Test {
    @int8 prop?: number;
    constructor(v?: number) { if (v !== undefined) this.prop = v; }
}

class Uint16Test {
    @uint16 prop?: number;
    constructor(v?: number) { if (v !== undefined) this.prop = v; }
}

class Int16Test {
    @int16 prop?: number;
    constructor(v?: number) { if (v !== undefined) this.prop = v; }
}

class Uint32Test {
    @uint32 prop?: number;
    constructor(v?: number) { if (v !== undefined) this.prop = v; }
}

class Int32Test {
    @int32 prop?: number;
    constructor(v?: number) { if (v !== undefined) this.prop = v; }
}

class Uint64NumTest {
    @uint64 prop?: number;
    constructor(v?: number) { if (v !== undefined) this.prop = v; }
}

class Uint64BigTest {
    @uint64 prop?: bigint;
    constructor(v?: bigint) { if (v !== undefined) this.prop = v; }
}

class Int64NumTest {
    @int64 prop?: number;
    constructor(v?: number) { if (v !== undefined) this.prop = v; }
}

class Int64BigTest {
    @int64 prop?: bigint;
    constructor(v?: bigint) { if (v !== undefined) this.prop = v; }
}

class BigIntTest {
    @bigInt prop?: bigint;
    constructor(v?: bigint) { if (v !== undefined) this.prop = v; }
}

class BigUintTest {
    @bigUint prop?: bigint;
    constructor(v?: bigint) { if (v !== undefined) this.prop = v; }
}

class BigIntNumTest {
    @bigInt prop?: number;
    constructor(v?: number) { if (v !== undefined) this.prop = v; }
}

class BigUintNumTest {
    @bigUint prop?: number;
    constructor(v?: number) { if (v !== undefined) this.prop = v; }
}

class BoolTest {
    @bool prop?: boolean;
    constructor(v?: boolean) { if (v !== undefined) this.prop = v; }
}

class StrTest {
    @str prop?: string;
    constructor(v?: string) { if (v !== undefined) this.prop = v; }
}

class BytesNumArrayTest {
    @bytes prop?: number[];
    constructor(v?: number[]) { if (v !== undefined) this.prop = v; }
}

class BytesTypedArrayTest {
    @bytes prop?: Uint8Array;
    constructor(v?: Uint8Array) { if (v !== undefined) this.prop = v; }
}

class BytesTypedClampedArrayTest {
    @bytes prop?: Uint8ClampedArray;
    constructor(v?: Uint8ClampedArray) { if (v !== undefined) this.prop = v; }
}

class UndecoratedNumberTest {
    @auto prop?: number;
    constructor(v?: number) {
        if (v !== undefined) this.prop = v;
    }
}

class UndecoratedStrTest {
    prop?: string;
    constructor(v?: string) {
        if (v !== undefined) this.prop = v;
    }
}

class UndecoratedBytesTest {
    prop: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
}

class UndecoratedBoolTest {
    prop: boolean = true;
}

class UndecoratedBigIntTest {
    prop: bigint = 12345678901234567890n;
}

describe("Atomics", () => {
    it("uint8", () => {
        const w = new Writer();
        const inst = new Uint8Test(123);
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(1);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Uint8Test);
        expect(res).toBeInstanceOf(Uint8Test);
        expect(res).toEqual(inst);
    });
    it("uint8: undefined", () => {
        const w = new Writer();
        const inst = new Uint8Test();
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(1);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Uint8Test);
        expect(res).toBeInstanceOf(Uint8Test);
        expect(res).toEqual(new Uint8Test(0));
    });
    it("int8", () => {
        const w = new Writer();
        const inst = new Int8Test(-123);
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(1);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Int8Test);
        expect(res).toBeInstanceOf(Int8Test);
        expect(res).toEqual(inst);
    });
    it("int8: undefined", () => {
        const w = new Writer();
        const inst = new Int8Test();
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(1);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Int8Test);
        expect(res).toBeInstanceOf(Int8Test);
        expect(res).toEqual(new Int8Test(0));
    });
    it("uint16", () => {
        const w = new Writer();
        const inst = new Uint16Test(12345);
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(2);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Uint16Test);
        expect(res).toBeInstanceOf(Uint16Test);
        expect(res).toEqual(inst);
    });
    it("uint16: undefined", () => {
        const w = new Writer();
        const inst = new Uint16Test();
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(2);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Uint16Test);
        expect(res).toBeInstanceOf(Uint16Test);
        expect(res).toEqual(new Uint16Test(0));
    });
    it("int16", () => {
        const w = new Writer();
        const inst = new Int16Test(-12345);
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(2);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Int16Test);
        expect(res).toBeInstanceOf(Int16Test);
        expect(res).toEqual(inst);
    });
    it("int16: undefined", () => {
        const w = new Writer();
        const inst = new Int16Test();
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(2);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Int16Test);
        expect(res).toBeInstanceOf(Int16Test);
        expect(res).toEqual(new Int16Test(0));
    });
    it("uint32", () => {
        const w = new Writer();
        const inst = new Uint32Test(12345);
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(4);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Uint32Test);
        expect(res).toBeInstanceOf(Uint32Test);
        expect(res).toEqual(inst);
    });
    it("uint32: undefined", () => {
        const w = new Writer();
        const inst = new Uint32Test();
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(4);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Uint32Test);
        expect(res).toBeInstanceOf(Uint32Test);
        expect(res).toEqual(new Uint32Test(0));
    });
    it("int32", () => {
        const w = new Writer();
        const inst = new Int32Test(-12345);
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(4);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Int32Test);
        expect(res).toBeInstanceOf(Int32Test);
        expect(res).toEqual(inst);
    });
    it("int32: undefined", () => {
        const w = new Writer();
        const inst = new Int32Test();
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(4);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Int32Test);
        expect(res).toBeInstanceOf(Int32Test);
        expect(res).toEqual(new Int32Test(0));
    });
    it("uint64: Number", () => {
        const w = new Writer();
        const inst = new Uint64NumTest(123456789);
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(8);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Uint64NumTest);
        expect(res).toBeInstanceOf(Uint64NumTest);
        expect(res.prop).toBeNumber();
        expect(res).toEqual(inst);
    });
    it("uint64: BigInt", () => {
        const w = new Writer();
        const inst = new Uint64BigTest(123456789n);
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(8);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Uint64BigTest);
        expect(res).toBeInstanceOf(Uint64BigTest);
        expect(typeof res.prop).toBe("bigint");
        expect(res).toEqual(inst);
    });
    it("uint64: undefined", () => {
        const w = new Writer();
        const inst = new Uint64NumTest();
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(8);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Uint64NumTest);
        expect(res).toBeInstanceOf(Uint64NumTest);
        expect(res.prop).toBeNumber();
        expect(res).toEqual(new Uint64NumTest(0));
    });
    it("int64: Number", () => {
        const w = new Writer();
        const inst = new Int64NumTest(-123456789);
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(8);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Int64NumTest);
        expect(res).toBeInstanceOf(Int64NumTest);
        expect(res.prop).toBeNumber();
        expect(res).toEqual(inst);
    });
    it("int64: BigInt", () => {
        const w = new Writer();
        const inst = new Int64BigTest(-123456789n);
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(8);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Int64BigTest);
        expect(res).toBeInstanceOf(Int64BigTest);
        expect(typeof res.prop).toBe("bigint");
        expect(res).toEqual(inst);
    });
    it("int64: undefined", () => {
        const w = new Writer();
        const inst = new Int64NumTest();
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(8);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Int64NumTest);
        expect(res).toBeInstanceOf(Int64NumTest);
        expect(res.prop).toBeNumber();
        expect(res).toEqual(new Int64NumTest(0));
    });
    it("bigInt: neg bigint", () => {
        const w = new Writer();
        const inst = new BigIntTest(-987654321n);
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(BigIntTest);
        expect(res).toBeInstanceOf(BigIntTest);
        expect(res).toEqual(inst);
    });
    it("bigInt: pos bigint", () => {
        const w = new Writer();
        const inst = new BigIntTest(987654321n);
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(BigIntTest);
        expect(res).toBeInstanceOf(BigIntTest);
        expect(res).toEqual(inst);
    });
    it("bigInt: number", () => {
        const w = new Writer();
        const inst = new BigIntNumTest(123456);
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(BigIntNumTest);
        expect(res).toBeInstanceOf(BigIntNumTest);
        expect(res).toEqual(inst);
    });
    it("bigUint: pos", () => {
        const w = new Writer();
        const inst = new BigUintTest(987654321n);
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(BigUintTest);
        expect(res).toBeInstanceOf(BigUintTest);
        expect(res).toEqual(inst);
    });
    it("bigUint: neg", () => {
        const w = new Writer();
        const inst = new BigUintTest(-987654321n);
        expect(() => new Encoder(w).marshal(inst)).toThrow();
    });
    it("bigUint: number", () => {
        const w = new Writer();
        const inst = new BigUintNumTest(123456);
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(BigUintNumTest);
        expect(res).toBeInstanceOf(BigUintNumTest);
        expect(res).toEqual(inst);
    });
    it("bool: true", () => {
        const w = new Writer();
        const inst = new BoolTest(true);
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(1);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(BoolTest);
        expect(res).toBeInstanceOf(BoolTest);
        expect(res).toEqual(inst);
    });
    it("bool: false", () => {
        const w = new Writer();
        const inst = new BoolTest(false);
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(1);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(BoolTest);
        expect(res).toBeInstanceOf(BoolTest);
        expect(res).toEqual(inst);
    });
    it("bool: undefined", () => {
        const w = new Writer();
        const inst = new BoolTest();
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(1);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(BoolTest);
        expect(res).toBeInstanceOf(BoolTest);
        expect(res).toEqual(new BoolTest(false));
    });
    it("str", () => {
        const w = new Writer();
        const inst = new StrTest("abcd");
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(4);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(StrTest);
        expect(res).toBeInstanceOf(StrTest);
        expect(res).toEqual(inst);
    });
    it("str: undefined", () => {
        const w = new Writer();
        const inst = new StrTest();
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(0);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(StrTest);
        expect(res).toBeInstanceOf(StrTest);
        expect(res).toEqual(new StrTest(""));
    });
    it("bytes: Number[]", () => {
        const w = new Writer();
        const inst = new BytesNumArrayTest([1, 2, 3, 4, 5]);
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(5);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(BytesNumArrayTest);
        expect(res).toBeInstanceOf(BytesNumArrayTest);
        expect(res).toEqual(inst);
    });
    it("bytes: Number[]: undefined", () => {
        const w = new Writer();
        const inst = new BytesNumArrayTest();
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(0);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(BytesNumArrayTest);
        expect(res).toBeInstanceOf(BytesNumArrayTest);
        expect(res).toEqual(new BytesNumArrayTest([]));
    });
    it("bytes: Uint8Array[]", () => {
        const w = new Writer();
        const inst = new BytesTypedArrayTest(new Uint8Array([1, 2, 3, 4, 5]));
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(5);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(BytesTypedArrayTest);
        expect(res).toBeInstanceOf(BytesTypedArrayTest);
        expect(res).toEqual(inst);
    });
    it("bytes: Uint8Array[]: undefined", () => {
        const w = new Writer();
        const inst = new BytesTypedArrayTest();
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(0);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(BytesTypedArrayTest);
        expect(res).toBeInstanceOf(BytesTypedArrayTest);
        expect(res).toEqual(new BytesTypedArrayTest(new Uint8Array()));
    });
    it("bytes: Uint8ClampedArray[]", () => {
        const w = new Writer();
        const inst = new BytesTypedClampedArrayTest(new Uint8ClampedArray([1, 2, 3, 4, 5]));
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(5);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(BytesTypedClampedArrayTest);
        expect(res).toBeInstanceOf(BytesTypedClampedArrayTest);
        expect(res).toEqual(inst);
    });
    it("undecorated: number", () => {
        const w = new Writer();
        const inst = new UndecoratedNumberTest(123456);
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(4);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(UndecoratedNumberTest);
        expect(res).toBeInstanceOf(UndecoratedNumberTest);
        expect(res).toEqual(inst);
    });
    it("undecorated: undefined number", () => {
        const w = new Writer();
        const inst = new UndecoratedNumberTest();
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(4);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(UndecoratedNumberTest);
        expect(res).toBeInstanceOf(UndecoratedNumberTest);
        expect(res).toEqual(new UndecoratedNumberTest(0));
    });
    it("undecorated: string", () => {
        const w = new Writer();
        const inst = new UndecoratedStrTest("test");
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(4);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(new UndecoratedStrTest(""));
        expect(res).toBeInstanceOf(UndecoratedStrTest);
        expect(res).toEqual(inst);
    });
    it("undecorated: encode undefined type", () => {
        const w = new Writer();
        const inst = new UndecoratedStrTest();
        inst.prop = undefined;
        expect(() => new Encoder(w).marshal(inst)).toThrow();
    });
    it("undecorated: decode undefined type", () => {
        const r = new Reader(new Uint8Array());
        const inst = new UndecoratedStrTest();
        inst.prop = undefined;
        expect(() => new Decoder(r).unmarshal(inst)).toThrow();
    });
    it("undecorated: bytes", () => {
        const w = new Writer();
        const inst = new UndecoratedBytesTest();
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(5);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(UndecoratedBytesTest);
        expect(res).toBeInstanceOf(UndecoratedBytesTest);
        expect(res).toEqual(inst);
    });
    it("undecorated: boolean", () => {
        const w = new Writer();
        const inst = new UndecoratedBoolTest();
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(1);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(UndecoratedBoolTest);
        expect(res).toBeInstanceOf(UndecoratedBoolTest);
        expect(res).toEqual(inst);
    });
    it("undecorated: bigint", () => {
        const w = new Writer();
        const inst = new UndecoratedBigIntTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(UndecoratedBigIntTest);
        expect(res).toBeInstanceOf(UndecoratedBigIntTest);
        expect(res).toEqual(inst);
    });
    it("undecorated: array decode", () => {
        const r = new Reader(new Uint8Array([
            0, 0, 0, 0,
            0, 0, 0, 1,
            0, 0, 0, 2,
            0, 0, 0, 3,
        ]));
        const inst: number[] = [0, 0, 0, 0];
        const res = new Decoder(r).unmarshal(inst);
        expect(res).toEqual([0, 1, 2, 3]);
    });
});

class ElemUint32Test {
    @elem<number>(Number, uint32) prop?: number[] = [1, 2, 3, 4, 5];
}

class ElemUint64Test {
    @elem<bigint>(BigInt, uint64) prop: bigint[] = [1n, 2n, 3n, 4n, 5n];
}

class ElemStrTest {
    @elem(VarString) prop: VarString[] = [new VarString("aaa"), new VarString("bbb"), new VarString("ccc")];
}

class StrEnumTest {
    @strEnum<string>([
        ["aaa", 0],
        ["bbb", 1],
        ["ccc", 2],
    ]) prop: string = "bbb";
}

class StrEnumU16Test {
    @strEnum([
        ["aaa", 0],
        ["bbb", 1],
        ["ccc", 2],
    ], uint16) prop: "aaa" | "bbb" | "ccc" = "ccc";
}

class StrEnumU16AutoTest {
    @strEnum([
        ["aaa", 0],
        ["bbb", 1],
        ["ccc", 0x1234],
    ]) prop: "aaa" | "bbb" | "ccc" = "bbb";
}

class StrEnumU32AutoTest {
    @strEnum([
        ["aaa", 0],
        ["bbb", 1],
        ["ccc", 0x12341234],
    ]) prop: "aaa" | "bbb" | "ccc" = "bbb";
}

class UnionTest {
    @union<BigIntTest | ElemStrTest | string>([
        [BigIntTest, 0],
        [ElemStrTest, 1],
        [String, [2, str]],
    ])
    prop?: BigIntTest | ElemStrTest | string;
}

class UnionU32Test {
    @union<any>([
        [BigIntTest, 0],
        [ElemStrTest, 1],
        [String, [2, str]],
    ], uint32)
    prop?: any;
}

const TestInt32Encoding: Encoding<number> = {
    marshal: (w: ByteWriter, value?: number) => w.writeInt32(value || 0),
    unmarshal: (r: ByteReader) => r.readInt32(),
};

class UnionTestCustomEnc {
    @union<BigIntTest | number>([
        [BigIntTest, 0],
        [Number, [1, TestInt32Encoding]],
    ])
    prop?: BigIntTest | number;
}

describe("Complex", () => {
    it("elem: uint32", () => {
        const w = new Writer();
        const inst = new ElemUint32Test();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(ElemUint32Test);
        expect(res).toBeInstanceOf(ElemUint32Test);
        expect(res).toEqual(inst);
    });
    it("elem: uint64", () => {
        const w = new Writer();
        const inst = new ElemUint64Test();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(ElemUint64Test);
        expect(res).toBeInstanceOf(ElemUint64Test);
        expect(res).toEqual(inst);
    });
    it("elem: VarString", () => {
        const w = new Writer();
        const inst = new ElemStrTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(ElemStrTest);
        expect(res).toBeInstanceOf(ElemStrTest);
        expect(res).toEqual(inst);
    });
    it("elem: empty", () => {
        const w = new Writer();
        const inst = new ElemUint32Test();
        inst.prop = undefined;
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(0);
    });
    it("strEnum", () => {
        const w = new Writer();
        const inst = new StrEnumTest();
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(1);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(StrEnumTest);
        expect(res).toBeInstanceOf(StrEnumTest);
        expect(res).toEqual(inst);
    });
    it("strEnum: undefined string", () => {
        const w = new Writer();
        const inst = new StrEnumTest();
        inst.prop = "test";
        expect(() => new Encoder(w).marshal(inst)).toThrow();
    });
    it("strEnum: undefined code", () => {
        const r = new Reader(new Uint8Array([123]));
        expect(() => new Decoder(r).unmarshal(StrEnumTest)).toThrow();
    });
    it("strEnum: Uint16", () => {
        const w = new Writer();
        const inst = new StrEnumU16Test();
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(2);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(StrEnumU16Test);
        expect(res).toBeInstanceOf(StrEnumU16Test);
        expect(res).toEqual(inst);
    });
    it("strEnum: auto: Uint16", () => {
        const w = new Writer();
        const inst = new StrEnumU16AutoTest();
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(2);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(StrEnumU16AutoTest);
        expect(res).toBeInstanceOf(StrEnumU16AutoTest);
        expect(res).toEqual(inst);
    });
    it("strEnum: auto: Uint32", () => {
        const w = new Writer();
        const inst = new StrEnumU32AutoTest();
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(4);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(StrEnumU32AutoTest);
        expect(res).toBeInstanceOf(StrEnumU32AutoTest);
        expect(res).toEqual(inst);
    });
    it("union: string[]", () => {
        const w = new Writer();
        const inst = new UnionTest();
        inst.prop = new ElemStrTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(UnionTest);
        expect(res).toBeInstanceOf(UnionTest);
        expect(res).toEqual(inst);
    });
    it("union: bigint", () => {
        const w = new Writer();
        const inst = new UnionTest();
        inst.prop = new BigIntTest(1234567890n);
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(UnionTest);
        expect(res).toBeInstanceOf(UnionTest);
        expect(res).toEqual(inst);
    });
    it("union: custom", () => {
        const w = new Writer();
        const inst = new UnionTestCustomEnc();
        inst.prop = 12345;
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(5);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(UnionTestCustomEnc);
        expect(res).toBeInstanceOf(UnionTestCustomEnc);
        expect(res).toEqual(inst);
    });
    it("union: uint32", () => {
        const w = new Writer();
        const inst = new UnionU32Test();
        inst.prop = new BigIntTest(1234567890n);
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(UnionU32Test);
        expect(res).toBeInstanceOf(UnionU32Test);
        expect(res).toEqual(inst);
    });
    it("union: undefined type", () => {
        const w = new Writer();
        const inst = new UnionU32Test();
        inst.prop = 12345;
        expect(() => new Encoder(w).marshal(inst)).toThrow();
    });
    it("union: undefined tag", () => {
        const r = new Reader(new Uint8Array([123, 123, 123, 123]));
        expect(() => new Decoder(r).unmarshal(UnionU32Test)).toThrow();
    });
});

@variable
class VariableTest {
    @str prop: string = "aaa";
}

class VariablePropTest {
    @variable @str prop?: string = "aaa";
}

@fixed(16)
class FixedTest {
    @str prop: string = "aaa";
}

class FixedPropTest {
    @fixed(16) @str prop?: string = "aaa";
}

class OptionalTest {
    @optional @str prop?: string;
}

class OptionalDefaultTypeTest {
    @optional prop?: string;
}

describe("Modifiers", () => {
    it("variable object", () => {
        const w = new Writer();
        const inst = new VariableTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(VariableTest);
        expect(res).toBeInstanceOf(VariableTest);
        expect(res).toEqual(inst);
    });
    it("variable property", () => {
        const w = new Writer();
        const inst = new VariablePropTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(VariablePropTest);
        expect(res).toBeInstanceOf(VariablePropTest);
        expect(res).toEqual(inst);
    });
    it("variable property: empty", () => {
        const w = new Writer();
        const inst = new VariablePropTest();
        inst.prop = undefined;
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(4);
    });
    it("variable property: short read", () => {
        const r = new Reader(new Uint8Array([0xaa, 0xaa, 0xaa, 0xaa]));
        expect(() => new Decoder(r).unmarshal(VariablePropTest)).toThrow();
    });
    it("fixed object", () => {
        const w = new Writer();
        const inst = new FixedTest();
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(16);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(FixedTest);
        expect(res).toBeInstanceOf(FixedTest);
        const tmp = new FixedTest();
        tmp.prop = "aaa\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000";
        expect(res).toEqual(tmp);
    });
    it("fixed object: truncate", () => {
        const w = new Writer();
        const inst = new FixedTest();
        inst.prop = "aaaaaaaaaaaaaaaaaaaaaaaa";
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(16);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(FixedTest);
        expect(res).toBeInstanceOf(FixedTest);
        const tmp = new FixedTest();
        tmp.prop = "aaaaaaaaaaaaaaaa";
        expect(res).toEqual(tmp);
    });
    it("fixed property", () => {
        const w = new Writer();
        const inst = new FixedPropTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(FixedPropTest);
        expect(res).toBeInstanceOf(FixedPropTest);
        const tmp = new FixedPropTest();
        tmp.prop = "aaa\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000";
        expect(res).toEqual(tmp);
    });
    it("fixed property: undefined", () => {
        const w = new Writer();
        const inst = new FixedPropTest();
        inst.prop = undefined;
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(16);
    });
    it("fixed property: short read", () => {
        const r = new Reader(new Uint8Array([0, 0, 0, 0]));
        expect(() => new Decoder(r).unmarshal(FixedPropTest)).toThrow();
    });
    it("optional: undefined", () => {
        const w = new Writer();
        const inst = new OptionalTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(OptionalTest);
        expect(res).toBeInstanceOf(OptionalTest);
        expect(res).toEqual(inst);
    });
    it("optional", () => {
        const w = new Writer();
        const inst = new OptionalTest();
        inst.prop = "aaa";
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(4);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(OptionalTest);
        expect(res).toBeInstanceOf(OptionalTest);
        expect(res).toEqual(inst);
    });
    it("optional: default type", () => {
        const w = new Writer();
        const inst = new OptionalDefaultTypeTest();
        inst.prop = "aaa";
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(4);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(OptionalDefaultTypeTest);
        expect(res).toBeInstanceOf(OptionalDefaultTypeTest);
        expect(res).toEqual(inst);
    });
});

@marshallable @unmarshallable
class SelfEncoding implements Marshallable {
    prop: number = 0;
    constructor(r?: ByteReader) {
        if (r) {
            this.prop = r.readInt32();
        }
    }
    marshal(w: ByteWriter) {
        w.writeInt32(this.prop);
    }
}

class AutoConstructTest {
    @auto prop?: Uint32Test;
    constructor(v?: Uint32Test) { if (v !== undefined) this.prop = v; }
}

describe("Miscellaneous", () => {
    it("manual", () => {
        const w = new Writer();
        const inst = new SelfEncoding();
        inst.prop = 1234567;
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(4);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(SelfEncoding);
        expect(res).toBeInstanceOf(SelfEncoding);
        expect(res).toEqual(inst);
    });

    it("construct on encode", () => {
        const w = new Writer();
        const inst = new AutoConstructTest();
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(4);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(AutoConstructTest);
        expect(res).toBeInstanceOf(AutoConstructTest);
        expect(res).toEqual(new AutoConstructTest(new Uint32Test(0)));
    });

    it("undecorated class", () => {
        const w = new Writer();
        const inst = new AutoConstructTest(new Uint32Test(0));
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(4);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(AutoConstructTest);
        expect(res).toBeInstanceOf(AutoConstructTest);
        expect(res).toEqual(inst);
    });

    it("encode an unwrapped array", () => {
        const w = new Writer();
        const inst: Number[] = [1, 2, 3, 4, 5];
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(20);
    });

    it("encode unwrapped map values", () => {
        const w = new Writer();
        const inst = new Map<string, number>([
            ["a", 0],
            ["b", 1],
            ["c", 2],
            ["d", 3],
        ]);
        new Encoder(w).marshal(inst);
        expect(w.length).toBe(16);
    });
});
