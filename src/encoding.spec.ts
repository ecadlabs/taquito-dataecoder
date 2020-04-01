import { uint8, int8, uint16, int16, uint32, int32, uint64, bigUint, bigInt, str, bytes, elem, strEnum, union, variable, fixed, optional } from "./encoding";
import { Writer } from "./writer";
import { Reader } from "./reader";
import { Encoder } from "./encoder";
import { Decoder } from "./decoder";
import { assert } from "chai";
import "mocha";
import { VarString } from "./helpers";

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
        assert.instanceOf(res, Uint8Test);
        assert.deepEqual(res, inst);
    });
    it("int8", () => {
        const w = new Writer();
        const inst = new Int8Test();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Int8Test);
        assert.instanceOf(res, Int8Test);
        assert.deepEqual(res, inst);

    });
    it("uint16", () => {
        const w = new Writer();
        const inst = new Uint16Test();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Uint16Test);
        assert.instanceOf(res, Uint16Test);
        assert.deepEqual(res, inst);
    });
    it("int16", () => {
        const w = new Writer();
        const inst = new Int16Test();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Int16Test);
        assert.instanceOf(res, Int16Test);
        assert.deepEqual(res, inst);
    });
    it("uint32", () => {
        const w = new Writer();
        const inst = new Uint32Test();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Uint32Test);
        assert.instanceOf(res, Uint32Test);
        assert.deepEqual(res, inst);
    });
    it("int32", () => {
        const w = new Writer();
        const inst = new Int32Test();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Int32Test);
        assert.instanceOf(res, Int32Test);
        assert.deepEqual(res, inst);
    });
    it("uint64: Number", () => {
        const w = new Writer();
        const inst = new Uint64NumTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Uint64NumTest);
        assert.instanceOf(res, Uint64NumTest);
        assert.typeOf(res.prop, "number");
        assert.deepEqual(res, inst);
    });
    it("uint64: BigInt", () => {
        const w = new Writer();
        const inst = new Uint64BigTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(Uint64BigTest);
        assert.instanceOf(res, Uint64BigTest);
        assert.typeOf(res.prop, "bigint");
        assert.deepEqual(res, inst);
    });
    it("bigInt", () => {
        const w = new Writer();
        const inst = new BigIntTest();
        inst.prop = -987654321n;
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(BigIntTest);
        assert.instanceOf(res, BigIntTest);
        assert.deepEqual(res, inst);
    });
    it("bigUint", () => {
        const w = new Writer();
        const inst = new BigUintTest();
        inst.prop = 987654321n;
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(BigUintTest);
        assert.instanceOf(res, BigUintTest);
        assert.deepEqual(res, inst);
    });
    it("str", () => {
        const w = new Writer();
        const inst = new StrTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(StrTest);
        assert.instanceOf(res, StrTest);
        assert.deepEqual(res, inst);
    });
    it("bytes: Number[]", () => {
        const w = new Writer();
        const inst = new BytesNumArrayTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(BytesNumArrayTest);
        assert.instanceOf(res, BytesNumArrayTest);
        assert.deepEqual(res, inst);
    });
    it("bytes: Uint8Array[]", () => {
        const w = new Writer();
        const inst = new BytesTypedArrayTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(BytesTypedArrayTest);
        assert.instanceOf(res, BytesTypedArrayTest);
        assert.deepEqual(res, inst);
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
        assert.instanceOf(res, ElemUint32Test);
        assert.deepEqual(res, inst);
    });
    it("elem: uint64", () => {
        const w = new Writer();
        const inst = new ElemUint64Test();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(ElemUint64Test);
        assert.instanceOf(res, ElemUint64Test);
        assert.deepEqual(res, inst);
    });
    it("elem: VarString", () => {
        const w = new Writer();
        const inst = new ElemStrTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(ElemStrTest);
        assert.instanceOf(res, ElemStrTest);
        assert.deepEqual(res, inst);
    });
    it("strEnum", () => {
        const w = new Writer();
        const inst = new StrEnumTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(StrEnumTest);
        assert.instanceOf(res, StrEnumTest);
        assert.deepEqual(res, inst);
    });
    it("strEnum: Uint16", () => {
        const w = new Writer();
        const inst = new StrEnumU16Test();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(StrEnumU16Test);
        assert.instanceOf(res, StrEnumU16Test);
        assert.deepEqual(res, inst);
    });
    it("union: string[]", () => {
        const w = new Writer();
        const inst = new UnionTest();
        inst.prop = new ElemStrTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(UnionTest);
        assert.instanceOf(res, UnionTest);
        assert.deepEqual(res, inst);
    });
    it("union: bigint", () => {
        const w = new Writer();
        const inst = new UnionTest();
        inst.prop = new BigIntTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(UnionTest);
        assert.instanceOf(res, UnionTest);
        assert.deepEqual(res, inst);
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
        assert.instanceOf(res, VariableTest);
        assert.deepEqual(res, inst);
    });
    it("variable property", () => {
        const w = new Writer();
        const inst = new VariablePropTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(VariablePropTest);
        assert.instanceOf(res, VariablePropTest);
        assert.deepEqual(res, inst);
    });
    it("fixed object", () => {
        const w = new Writer();
        const inst = new FixedTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(FixedTest);
        assert.instanceOf(res, FixedTest);
        const tmp = new FixedTest();
        tmp.prop = "aaa\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000";
        assert.deepEqual(res, tmp);
    });
    it("fixed property", () => {
        const w = new Writer();
        const inst = new FixedPropTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(FixedPropTest);
        assert.instanceOf(res, FixedPropTest);
        const tmp = new FixedPropTest();
        tmp.prop = "aaa\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000";
        assert.deepEqual(res, tmp);
    });
    it("optional: undefined", () => {
        const w = new Writer();
        const inst = new OptionalTest();
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(OptionalTest);
        assert.instanceOf(res, OptionalTest);
        assert.deepEqual(res, inst);
    });
    it("optional", () => {
        const w = new Writer();
        const inst = new OptionalTest();
        inst.prop = "aaa";
        new Encoder(w).marshal(inst);
        const r = new Reader(w.bytes);
        const res = new Decoder(r).unmarshal(OptionalTest);
        assert.instanceOf(res, OptionalTest);
        assert.deepEqual(res, inst);
    });
});