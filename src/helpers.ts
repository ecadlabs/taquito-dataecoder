import { str, variable } from "./encoding";

// Helper types

/**
 * Helper class for variable length strings
 *
 * | Contents | Size |
 * | -------- | ---- |
 * | Length | 4 |
 * | UTF-8 data | Variable |
 *
 */
@variable
export class VarString {
    @str value?: string;
    constructor(v?: string) {
        if (v !== undefined) {
            this.value = v;
        }
    }
}