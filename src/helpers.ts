import { str, variable } from "./encoding";

// Helper types
@variable
export class VarString {
    @str value?: string;
    constructor(v?: string) {
        if (v !== undefined) {
            this.value = v;
        }
    }
}