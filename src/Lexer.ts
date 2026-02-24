import { Token, TokenType } from "../types/types";

import { keywords } from "../constants/keywords";

export class Lexer {
    private source: string;

    private cursor: number = 0;
    private line: number = 1;
    private idx: number = 1;

    public constructor(source: string) {
        this.source = source;
    }

    private atEOF(): boolean {
        return this.cursor >= this.source.length;
    }

    private peek(): string {
        return this.atEOF() ? "\0" : this.source[this.cursor];
    }

    private peekNext(): string {
        return this.cursor + 1 >= this.source.length ? "\0" : this.source[this.cursor + 1];
    }

    private advance(): string {
        this.idx++;
        return this.source[this.cursor++];
    }

    private createToken(tokenType: TokenType, value: string): Token {
        return {
            type: tokenType,
            value: value,
            line: this.line,
            idx: this.idx - value.length,
        } satisfies Token;
    }

    public tokenize(): ReadonlyArray<Token> {
        const tokens: Token[] = [];

        while (!this.atEOF()) {
            const char: string = this.peek();

            if (/\s/.test(char)) {
                if (char === "\n") {
                    this.line++;
                    this.idx = 0;
                }
                this.advance();
                continue;
            }

            if (/[0-9]/.test(char)) {
                let nString: string = "";

                while (!this.atEOF() && /[0-9]/.test(this.peek())) nString += this.advance();

                tokens.push(this.createToken(TokenType.Number, nString));
            }

            if (/[a-zA-Z_]/.test(char)) {
                let text: string = "";

                while (!this.atEOF() && /[a-zA-Z0-9_]/.test(this.peek())) {
                    text += this.advance();
                }

                if ((keywords as readonly string[]).includes(text))
                    tokens.push(this.createToken(TokenType.Keyword, text));
                else tokens.push(this.createToken(TokenType.Identifier, text));

                continue;
            }

            if (char === '"') {
                this.advance();

                let str: string = "";

                while (!this.atEOF() && this.peek() !== '"') {
                    str += this.advance();
                }

                this.advance();

                tokens.push(this.createToken(TokenType.String, str));

                continue;
            }

            //

            if (char === "=" && this.peekNext() === "=") {
                this.advance();
                this.advance();

                tokens.push(this.createToken(TokenType.Equals, "=="));

                continue;
            }

            if (char === "!" && this.peek() === "=") {
                this.advance();
                this.advance();

                tokens.push(this.createToken(TokenType.NotEquals, "!="));

                continue;
            }

            if (char === ">" && this.peek() === "=") {
                this.advance();
                this.advance();

                tokens.push(this.createToken(TokenType.GreaterEquals, ">="));

                continue;
            }

            if (char === "<" && this.peek() === "=") {
                this.advance();
                this.advance();

                tokens.push(this.createToken(TokenType.LessEquals, "<="));

                continue;
            }

            const singleCharacterSymbol = this.advance();

            switch (singleCharacterSymbol) {
                case "+":
                    tokens.push(this.createToken(TokenType.Plus, "+"));
                    break;
                case "-":
                    tokens.push(this.createToken(TokenType.Minus, "-"));
                    break;
                case "*":
                    tokens.push(this.createToken(TokenType.Multiply, "*"));
                    break;
                case "/":
                    tokens.push(this.createToken(TokenType.Divide, "/"));
                    break;
                case ">":
                    tokens.push(this.createToken(TokenType.Greater, ">"));
                    break;
                case "<":
                    tokens.push(this.createToken(TokenType.Less, "<"));
                    break;
                case "(":
                    tokens.push(this.createToken(TokenType.ParenL, "("));
                    break;
                case ")":
                    tokens.push(this.createToken(TokenType.ParenR, ")"));
                    break;
                default:
                    tokens.push(this.createToken(TokenType.Unknown, singleCharacterSymbol));
                    console.warn(singleCharacterSymbol);
            }
        }

        tokens.push(this.createToken(TokenType.EOF, "EOF"));

        return tokens;
    }
}
