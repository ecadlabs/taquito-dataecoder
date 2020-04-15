import { uint8, int8, uint16, int16, uint32, int32, uint64, bigUint, bigInt, str, bytes, elem, strEnum, union, variable, fixed, optional } from "./encoding";
import { Writer } from "./writer";
import { Reader } from "./reader";
import { Encoder } from "./encoder";
import { Decoder } from "./decoder";
import { VarString } from "./helpers";
import "jest-extended";

class Uint8Test {
    @uint8 prop: number = 123;
}

class Int8Test {
    @int8 prop: number = -123;
}

class Uint16Test {
    @uint16 prop: number = 12345;
}

class Int16Test {
    @int16 prop: number = -12345;
}

class Uint32Test {
    @uint32 prop: number = 12345;
}

class Int32Test {
    @int32 prop: number = -12345;
}

class Uint64NumTest {
    @uint64 prop: number = 12345;
}

class Uint64BigTest {
    @uint64 prop: bigint = 12345n;
}

class BigIntTest {
    @bigInt prop: bigint = -12345678901234567890n;
}

class BigUintTest {
    @bigUint prop: bigint = 12345678901234567890n;
}

class StrTest {
    @str prop: string = "abcde";
}

class BytesNumArrayTest {
    @bytes prop: number[] = [1, 2, 3, 4, 5];
}

class BytesTypedArrayTest {
    @bytes prop: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
}

describe("Atomics", () => {
    it("uint8", () => {
        const w = new Writer();
        const inst = new Uint8Test();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Uint8Test);
        expect(res).toBeInstanceOf(Uint8Test);
        expect(res).toEqual(inst);
    });
    it("int8", () => {
        const w = new Writer();
        const inst = new Int8Test();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Int8Test);
        expect(res).toBeInstanceOf(Int8Test);
        expect(res).toEqual(inst);
    });
    it("uint16", () => {
        const w = new Writer();
        const inst = new Uint16Test();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Uint16Test);
        expect(res).toBeInstanceOf(Uint16Test);
        expect(res).toEqual(inst);
    });
    it("int16", () => {
        const w = new Writer();
        const inst = new Int16Test();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Int16Test);
        expect(res).toBeInstanceOf(Int16Test);
        expect(res).toEqual(inst);
    });
    it("uint32", () => {
        const w = new Writer();
        const inst = new Uint32Test();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Uint32Test);
        expect(res).toBeInstanceOf(Uint32Test);
        expect(res).toEqual(inst);
    });
    it("int32", () => {
        const w = new Writer();
        const inst = new Int32Test();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Int32Test);
        expect(res).toBeInstanceOf(Int32Test);
        expect(res).toEqual(inst);
    });
    it("uint64: Number", () => {
        const w = new Writer();
        const inst = new Uint64NumTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Uint64NumTest);
        expect(res).toBeInstanceOf(Uint64NumTest);
        expect(res.prop).toBeNumber();
        expect(res).toEqual(inst);
    });
    it("uint64: BigInt", () => {
        const w = new Writer();
        const inst = new Uint64BigTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Uint64BigTest);
        expect(res).toBeInstanceOf(Uint64BigTest);
        expect(typeof res.prop).toBe("bigint");
        expect(res).toEqual(inst);
    });
    it("bigInt", () => {
        const w = new Writer();
        const inst = new BigIntTest();
        inst.prop = -987654321n;
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(BigIntTest);
        expect(res).toBeInstanceOf(BigIntTest);
        expect(res).toEqual(inst);
    });
    it("bigUint", () => {
        const w = new Writer();
        const inst = new BigUintTest();
        inst.prop = 987654321n;
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(BigUintTest);
        expect(res).toBeInstanceOf(BigUintTest);
        expect(res).toEqual(inst);
    });
    it("str", () => {
        const w = new Writer();
        const inst = new StrTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(StrTest);
        expect(res).toBeInstanceOf(StrTest);
        expect(res).toEqual(inst);
    });
    it("bytes: Number[]", () => {
        const w = new Writer();
        const inst = new BytesNumArrayTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(BytesNumArrayTest);
        expect(res).toBeInstanceOf(BytesNumArrayTest);
        expect(res).toEqual(inst);
    });
    it("bytes: Uint8Array[]", () => {
        const w = new Writer();
        const inst = new BytesTypedArrayTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(BytesTypedArrayTest);
        expect(res).toBeInstanceOf(BytesTypedArrayTest);
        expect(res).toEqual(inst);
    });
});

class ElemUint32Test {
    @elem<number>(Number, uint32) prop: number[] = [1, 2, 3, 4, 5];
}

class ElemUint64Test {
    @elem<bigint>(BigInt, uint64) prop: bigint[] = [1n, 2n, 3n, 4n, 5n];
}

class ElemStrTest {
    @elem(VarString) prop: VarString[] = [new VarString("aaa"), new VarString("bbb"), new VarString("ccc")];
}

class StrEnumTest {
    @strEnum([
        ["aaa", 0],
        ["bbb", 1],
        ["ccc", 2],
    ]) prop: "aaa" | "bbb" | "ccc" = "bbb";
}

class StrEnumU16Test {
    @strEnum([
        ["aaa", 0],
        ["bbb", 1],
        ["ccc", 2],
    ], uint16) prop: "aaa" | "bbb" | "ccc" = "ccc";
}

class UnionTest {
    @union<BigIntTest | ElemStrTest | string>([
        [BigIntTest, 0],
        [ElemStrTest, 1],
        [String, [2, str]],
    ])
    prop?: BigIntTest | ElemStrTest | string;
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
    it("strEnum", () => {
        const w = new Writer();
        const inst = new StrEnumTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(StrEnumTest);
        expect(res).toBeInstanceOf(StrEnumTest);
        expect(res).toEqual(inst);
    });
    it("strEnum: Uint16", () => {
        const w = new Writer();
        const inst = new StrEnumU16Test();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(StrEnumU16Test);
        expect(res).toBeInstanceOf(StrEnumU16Test);
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
        inst.prop = new BigIntTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(UnionTest);
        expect(res).toBeInstanceOf(UnionTest);
        expect(res).toEqual(inst);
    });
});

@variable
class VariableTest {
    @str prop: string = "aaa";
}

class VariablePropTest {
    @variable @str prop: string = "aaa";
}

@fixed(16)
class FixedTest {
    @str prop: string = "aaa";
}

class FixedPropTest {
    @fixed(16) @str prop: string = "aaa";
}

class OptionalTest {
    @optional @str prop?: string;
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
    it("fixed object", () => {
        const w = new Writer();
        const inst = new FixedTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(FixedTest);
        expect(res).toBeInstanceOf(FixedTest);
        const tmp = new FixedTest();
        tmp.prop = "aaa\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000";
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
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(OptionalTest);
        expect(res).toBeInstanceOf(OptionalTest);
        expect(res).toEqual(inst);
    });
});