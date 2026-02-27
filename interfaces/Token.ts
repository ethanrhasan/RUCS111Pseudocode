import { TokenType } from "../types/types";

export interface Token {
    type: TokenType;
    value: string;
    line: number;
    idx: number;
}
